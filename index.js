var fs = require('fs')
var setkey = require('keymaster')
var {shell,remote} = require('electron')
var {globalShortcut, Menu} = remote.require('electron')
var win = remote.getCurrentWindow()

init()

function init() {
  config = {}
  currentConfig = null
  lock = false
  onmouseup = onkeyup = ()=>lock=false
  onblur = ()=>render('[root]')

  var lines = fs.readFileSync(process.env.HOME+'/OpenKeyConfig.txt','utf8').split('\n')
  var shortcut = lines.shift().split('//').shift()
  set_global_shortcut(shortcut)
  make_config(lines)
  setup_shortcuts()
  render('[root]')
}

function set_global_shortcut (shortcut) {
  globalShortcut.unregisterAll()
  globalShortcut.register(shortcut, () => {
    win.show()
    if (win.isFocused()){
      render('[root]')
    }
  })
}

function make_config(lines) {
  var alertArr = ["doesn't exist:"]
  lines.forEach( line=>{
    line = line.trim()
    if (!line.length) return
    if (line[0] == '[') {
      currentConfig = config[line] = {}
    }
    else {
      let [key, ...rest] = line.split(" ")
      if(!rest.length) return alertArr.push(key)
      key = expand_key(key)
      currentConfig[key] = name_link_arr(rest, alertArr)
    }
  })
  if(alertArr.length > 1) alert(alertArr.join('\n'))
}

function expand_key(key) {
  if (key.length==1 || key.indexOf('+')!= -1) return key
  let s = key.slice(0,-1)
  let m = ''
  if(s.indexOf('a') != -1) m+= '⌥+'
  if(s.indexOf('c') != -1) m+= '⌃+'
  if(s.indexOf('d') != -1) m+= '⌘+'
  if(s.indexOf('s') != -1) m+= '⇧+'
  return m + key.slice(-1)
}

function name_link_arr(rest, alertArr) {
  var [first, ...rrest] = rest
  var link = rest.join(' ')
  var name

  if(first[0]=='['){
    name = link
    link = 0
  }
  else if(first[0]=='~' || first[0]=='/'){
    name = link.split('/').pop().replace('.app', '')
  }
  else if(valid_url(first) && !rrest.length){
    name = domain_name(first)
  }
  else{
    name = first
    link = rrest.join(' ')
  }
  return [name, add_protocol(link, alertArr)]
}
function valid_url (str) {
  return str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
}
function domain_name (str) {
  if (str.indexOf("://") > -1) str = str.split('/')[2]
  else str = str.split('/')[0]
  var arr = str.replace('www.','').split('.')
  if(arr.length > 2) return arr.slice(0,2).join('.')
  return arr[0]
}
function add_protocol(link, alertArr) {
  if (!link || link.indexOf(':') !== -1) return link
  if (link[0] == '~') link = process.env.HOME + link.slice(1)
  if (fs.existsSync(link)) return 'file:' + fs.realpathSync(link)
  if (link[0] == '/') alertArr.push(link)
  return 'http:' + link
}

function setup_shortcuts() {
  for (let scope in config) {
    for (let key in config[scope]) {
      setkey(key, scope, (e,{key})=>open(key) )
    }
  }
  setkey('esc', () => Menu.sendActionToFirstResponder('hide:') )
  setkey('⌘+q', ()=> remote.app.quit() )
}

function open(shortcut){
  if (lock) return
  let [name, link] = currentConfig[shortcut]
  if (link) {
    shell.openExternal(link)
    lock = true
    render('[root]')
  } else {
    if(config[name])
      render(name)
    else
      alert('no config:\n' + name)
  }
}

var o = open
function render(scope) {
  setkey.setScope(scope)
  currentConfig = config[scope]
  let html = ''
  for (let key in currentConfig) {
    let [name, link] = currentConfig[key]
    html += `<li title="${link||name}" onclick="o('${key}')"><span class="name">${name}</span> ${key.replace(/\+/g,'')}</li>`
  }
  document.body.innerHTML = html
  resize()
}

function resize() {
  let len = Object.keys(currentConfig).length
  let n = Math.ceil(len/20)
  let h = Math.ceil(len/n)
  win.setSize(n*241,30*h+10)
}
