# Notepad++
## 快捷键
* 这个是比较基础的，我们可以在设置->管理快捷键中修改。比较常见的比方说
* 上下移动当前行ctrl+shift+up/down;
* 复制当前行 ctrl + D;
* 函数参数提示 ctrl+shift+space，单词自动完成ctrl+enter
* 行注释、区块注释 ….
* 可以根据自己的操作习惯来更改快捷键的设置，很任性化。
* 需要注意的是，很多时候我们发现快捷键设置了没有用，这是因为和其他软件比方说输入法、QQ之类的快捷键产生了冲突，这时候我们需要将快捷键修改成未被其他软件占用的热键。

## 操作
 一些常用的操作

### 自动完成和字符编码
* 曾经有人因为notepad++没有自动完成功能而转投其他IDE，但其实小巧的notepad++也是有这个功能的，在设置->首选项里完成设置即可。
* 在web编程时，字符编码是很需要注意的一点，淘宝规范的是GBK编码，我们可以在设置->新建里面，选择默认的编码。

### 支持列编辑模式
* 按住Alt之后，就处于列模式了，然后比如你选取一列，然后点击右键，选中删除，就可以删除那些列了，松掉ALT就离开了ALT恢复普通模式了。
* 列操作模式中的在整个列中，整个都插入一些内容的话，可以这样操作：
Edit -> Column Editor (Alt C)
* 然后在Text to insert或Number to insert对应的的框中写入要插入的内容，notepad++就会自动帮你插入整列的对应的内容了。   

### 语言格式设置
* 点击设置-》语言格式设置，可以根据自己的视觉喜好设置整个编辑器的颜色字体主题等，让你的编辑器更具个性化。

### 宏
* Notepad++可以记录你在编辑文档中进行的操作，并且可以在以后重复这些记录的操作。这种功能叫做宏，可以为你节省很多时间。宏可以在重复执行一次或多次，即使是对整个文档进行操作。你可以保存宏以便在未来使用，为宏指定快捷键以便快速调用宏。宏和光标当前所处的位置有关，宏的操作（通常情况下）相对于光标的当前位置。

* 要录制宏,选择宏->开始录制或者按工具栏上的开始录制按钮。Notepad++会记录文档内容的变化以及你对文档进行的操作。
* 在宏录制停止后，宏会被保存在一个临时的缓冲区中。如果你没有进行进一步的操作，此缓冲区将会被清空。如果你在开始新的宏录制之前没有保存之前录制的宏，那么之前录制的宏就会丢失。
要播放缓冲区中的宏,选择宏->播放或者单击播放按钮。这样将会在当前的光标位置进行一次宏操作
* 要保存缓冲区中的宏,选择宏->保存当前宏或者单击保存按钮。此时将会出现一个对话框，询问你为要保存宏设置的名称及默认的快捷键。这些选项在之后都可以修改（或删除），通过快捷键管理。在宏保存之后，保存的宏将会在宏菜单或者宏列表中显示。

## 插件

### Nppexport
* 这是notepad++默认安装的插件，通过这款插件，我们可以方便的导出着色以后的代码，这样即使在word里，我们也可以方便的粘贴上着色后的代码

### Explorer
* 可以在notepad++中启用资源浏览器功能
  
### TextFx
* 这款插件可以很方便的定义括号自动补全等功能
* 其他还有functionlist ,jsonview等等方便我们分析代码的插件，这里不逐一例举。
* 可以消除文件中的空行,选中所有文本, 
    TextFX--->Edit--->Delete Blank lines
* 整理xml文本格式
    这个功能超好，经常遇到几百KB左右的xml文本就是一行，可以使用
它很快将一行文本整理成规范的xml文件。
    选中所有文本
    TextFX--->HTML Tidy--->Tidy: Reindent XML
* 直接在你的文本行前自动添加行号：
   选中所有文本
   TextFX--->Tools--->Insert Line Numbers

### zen-coding
* zen-Coding是一款快速编写HTML,CSS（或其他格式化语言）代码的编辑器插件，这个插件可以用缩写方式完成大量重复的编码工作，是web前端从业者的利器。
* 输入如下代码，div#header>div#logo+ul.nav>li.item-$*5>a，按ctrl+E ,即可得到如下代码：
> `<div id="header">
    <div id="logo"></div>
    <ul class="nav">
        <li class="item-1"><a href=""></a></li>
        <li class="item-2"><a href=""></a></li>
        <li class="item-3"><a href=""></a></li>
        <li class="item-4"><a href=""></a></li>
        <li class="item-5"><a href=""></a></li>
    </ul>
</div>`




# Aptana
## 特点  
# VIM

# Fiddler