# Demo
![demo.gif](https://github.com/Eno2022/OpenKey/blob/master/demo.gif?raw=true)

# 使用
[国内下载链接](https://pan.baidu.com/s/1pKP6hXD)

[使用说明及对比](http://www.jianshu.com/p/b6718b76a228)

# 配置说明
按下全局快捷键（默认F1）再按c（默认）即可打开配置文件，实际路径为“~/OpenKeyConfig.txt”，按照格式修改并保存即可。（启动时如果没有这个文件会自动创建一个基本的配置文件）
```
F1  // format: Alt+Cmd+Ctrl+Shift+Key
[root]
c CONFIG ~/OpenKeyConfig.txt
p /Applications/System Preferences.app
acdss [apps]
...
```
第一行固定是全局快捷键，格式为Alt+Cmd+Ctrl+Shift+Key。[具体文档](http://electron.atom.io/docs/api/accelerator/)

下面的 [xxx] 表明分类。 （必须要有最基本的[root]分类）

然后是快捷键配置，格式为 缩写+空格+名字+空格+地址。

名字可以省略（不能有空格）， 默认用网址的域名或文件名。

修饰键缩写为：a-alt，c-ctrl，d-command，s-shift，最后加上字母、数字或符号，比如acdss表示alt+ctrl+command+shift+s，不支持特殊按键（留做备用）。

地址为任意网址或文件路径，可以有空格。（直接在finder里复制，再粘贴到编辑器里就是完整路径）

如果没有地址则会跳转到和名字相同的分类。
