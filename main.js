var {app, BrowserWindow, globalShortcut, Menu, Tray, shell} = require('electron')
var fs = require('fs')
var chokidar = require('chokidar')
var AutoLaunch = require('auto-launch')
var al = new AutoLaunch({name: 'OpenKey',path: fix_path()})
var configPath = process.env.HOME+'/OpenKeyConfig.txt'

app.on('ready', () => {
  if (app.dock) app.dock.hide()
  check_config_may_create()
  var win=new BrowserWindow({width:480, frame:false, transparent: true})
  win.loadURL('file:'+__dirname+'/index.html')
  chokidar.watch(configPath).on('change', () => {
    win.loadURL('file:'+__dirname+'/index.html')
  })
  create_tray()
})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

function check_config_may_create () {
  if(!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, fs.readFileSync(__dirname+'/config.txt'))
  }
}

function create_tray () {
  var tray = new Tray(__dirname+'/iconTemplate.png')
  al.isEnabled().then(function(checked){
    var contextMenu = Menu.buildFromTemplate([
      {label:'Config', click(){shell.openExternal('file:'+fs.realpathSync(configPath))} },
      {label:'Github Repo', click(){shell.openExternal('https://github.com/Eno2022/OpenKey')} },
      {label:'Launch at Login', type:'checkbox', checked, click: set_auto_launch },
      {label:'Relaunch', click(){app.relaunch(); app.quit()}},
      {label:'Quit', click: app.quit}
    ])
    tray.setContextMenu(contextMenu)
  })
}

function set_auto_launch (m) {
  if(m.checked)
    al.enable()
  else
    al.disable()
}
function fix_path () {
  return process.execPath.replace(/\/Contents\/MacOS\/[^\/]*$/, '')
}
