/**
 * User: xijian.py
 * Date: 12-10-18
 * Time: 下午10:33
 * Description:外观设计-创建欢迎页交互逻辑
 */
YUI().use('node','node-event-delegate',function(Y){

    var nLogoPreview = Y.one('.logo-preview');
    var nPicPreview = Y.one('.bb-pic-preview');



    Y.one('.selectTemplate').delegate('click',function(){
        Y.all('.radio').set('checked',false);
        this.one('.radio').set('checked',true);
    },'.tem-item')

    //点击选择不同的模板
    Y.one('.selectTemplate').delegate('click',function(){
        Y.all('.template').setStyle('display','none');
        Y.one('#template1').setStyle('display','block');
    },'.tem-item1')
    Y.one('.selectTemplate').delegate('click',function(){
        Y.all('.template').setStyle('display','none');
        Y.one('#template2').setStyle('display','block');
    },'.tem-item2')
    Y.one('.selectTemplate').delegate('click',function(){
        Y.all('.template').setStyle('display','none');
        Y.one('#template3').setStyle('display','block');
    },'.tem-item3')
    Y.one('.selectTemplate').delegate('click',function(){
        Y.all('.template').setStyle('display','none');
        Y.one('#template4').setStyle('display','block');
    },'.tem-item4')
    Y.one('.selectTemplate').delegate('click',function(){
        Y.all('.template').setStyle('display','none');
        Y.one('#template5').setStyle('display','block');
    },'.tem-item5')

    //输入框显示上传控件里选中的文件路径
    Y.one('.uploadPic .file').on('change',function(){
        this.previous('.txt').setAttribute('value',this.get("value"));
    })

    nLogoPreview.on('click',function(){
        var directory = Y.one('.txt').get('value');
        if(directory){
            Y.one('#logo1 img').setStyle('visibility','visible');
            Y.one('#logo2 img').setStyle('visibility','visible');
            Y.one('#logo3 img').setStyle('visibility','visible');
            Y.one('#logo4 img').setStyle('visibility','visible');
            Y.one('#logo5 img').setStyle('visibility','visible');
        }else{
            alert("亲，你还没有上传图片哦！");
        }
    })

    //上传logo点击预览
    /*
    nLogoPreview.on('click',function(){
        var directory = Y.one('.txt').get('value');
        if(directory){
            Y.all('.logo img').setAttribute('src',directory);
        }else{
            alert("亲，你还没有上传图片哦！");
        }
    })

    nLogoPreview.on('click',function(){
        var reader = new FileReader();
        reader.onload = function(e){
            displayImage($('bd'),e.target.result);
        }
        reader.readAsDataURL(file);
    })

    Y.one('.uploadPic .file').on('change',function(){
        //handleFiles(this.files);
        var reader = new FileReader();
        //alert(this);
        reader.onload = function(e){
            var directory = e.target.result;
            alert('h');
            Y.all('.logo img').setAttribute('src',directory);
        }
        reader.readAsDataURL(this);
    })
    */
    /*
    function handleFiles(file){
        var reader = new FileReader();
        reader.onload = function(e){
            alert(e.target.result);
            var directory = e.target.result;
            Y.all('.logo img').setAttribute('src',directory);
        }
        reader.readAsDataURL(file.files[0]);

    }
    */
    //点击添加宝贝图片
    /*
    Y.one('.addItem').delegate('change',function(){
        var img = '<img src="'+this.get('value')+'"/>';
        var btnChange = '<img src="./img/design/edit.PNG" />';
        this.previous('.addBox').setContent(img);
        this.previous('.editButton').setContent(btnChange);
    },'.addBox-file')

    Y.one('.addItem').delegate('change',function(file){
        var btnChange = '<img src="./img/design/edit.PNG" />';
        this.previous('.editButton').setContent(btnChange);



        var reader = new FileReader();
        reader.onload = function(e){
            var picUrl = e.target.result;
            var img = '<img src="'+picUrl+'"/>';
            this.previous('.addBox').setContent(img);
        }
        reader.readAsDataURL(file);


    },'.addBox-file')


    function displayImage(container,dataURL){
        var img = document.createElement('img');
        img.src = dataURL;
        container.setContent(img);
    }
    */
    //点击预览宝贝图片
    nPicPreview.on('click',function(){
        if(Y.one('.addBox1').hasChild('img')){
            Y.all('.pic-box1 img').setAttribute('src', Y.one('.addBox1 img').getAttribute('src'));
        }else{
            alert('亲，你还没有上传图片哦！');
        }
    })
});


function $(id){
    return document.getElementById(id);
}
function displayImage(container,dataURL){
    container.innerHTML = '<img src="'+dataURL+'"/>';
}
function handleFilesLogo(files){
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;

        if (!file.type.match(imageType)) {
            alert('亲，上传的图片格式不正确哦！');
            continue;
        }
        var reader = new FileReader();
        reader.onload = function(e){
            displayImage($('logo1'),e.target.result);
            displayImage($('logo2'),e.target.result);
            displayImage($('logo3'),e.target.result);
            displayImage($('logo4'),e.target.result);
            displayImage($('logo5'),e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

function handlePic(files){
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;

        if (!file.type.match(imageType)) {
            alert('error');
            continue;
        }
        var reader = new FileReader();
        reader.onload = function(e){
            displayImage($('addBox1'),e.target.result);
        }
        reader.readAsDataURL(file);
    }
}




