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

    //点击添加宝贝图片--切换按钮
    Y.one('.addItem').delegate('change',function(){
        var btnChange = '<img src="./img/design/edit.PNG" />';
        this.previous('.editButton').setContent(btnChange);
    },'.addBox-file')
    //点击预览宝贝图片
    function previewBB(picBox,addBox){
        picBox.setContent('<img src="'+addBox.getAttribute('src')+'" />');
    };
    nPicPreview.on('click',function(){
        //var src = Y.one('.addBox1 img').getAttribute('src');
        //var img = '<img src="'+src+'" />';
        Y.all('.pic-box1').setContent('<img src="'+Y.one('.addBox1 img').getAttribute('src')+'" />');
        Y.all('.pic-box2').setContent('<img src="'+Y.one('.addBox2 img').getAttribute('src')+'" />');
        Y.all('.pic-box3').setContent('<img src="'+Y.one('.addBox3 img').getAttribute('src')+'" />');
        Y.all('.pic-box4').setContent('<img src="'+Y.one('.addBox4 img').getAttribute('src')+'" />');
        Y.all('.pic-box5').setContent('<img src="'+Y.one('.addBox5 img').getAttribute('src')+'" />');
        Y.all('.pic-box6').setContent('<img src="'+Y.one('.addBox6 img').getAttribute('src')+'" />');
        Y.all('.pic-box7').setContent('<img src="'+Y.one('.addBox7 img').getAttribute('src')+'" />');
        Y.all('.pic-box8').setContent('<img src="'+Y.one('.addBox8 img').getAttribute('src')+'" />');
        Y.all('.pic-box9').setContent('<img src="'+Y.one('.addBox9 img').getAttribute('src')+'" />');
        Y.all('.pic-box10').setContent('<img src="'+Y.one('.addBox10 img').getAttribute('src')+'" />');
        Y.all('.pic-box11').setContent('<img src="'+Y.one('.addBox11 img').getAttribute('src')+'" />');
        Y.all('.pic-box12').setContent('<img src="'+Y.one('.addBox12 img').getAttribute('src')+'" />');
        Y.all('.pic-box13').setContent('<img src="'+Y.one('.addBox13 img').getAttribute('src')+'" />');
        Y.all('.pic-box14').setContent('<img src="'+Y.one('.addBox14 img').getAttribute('src')+'" />');
        Y.all('.pic-box15').setContent('<img src="'+Y.one('.addBox15 img').getAttribute('src')+'" />');
        Y.all('.pic-box16').setContent('<img src="'+Y.one('.addBox16 img').getAttribute('src')+'" />');
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

function handlePic(files,addBox){
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;

        if (!file.type.match(imageType)) {
            alert('亲，上传的图片格式不正确哦！');
            continue;
        }
        var reader = new FileReader();
        reader.onload = function(e){
            displayImage(addBox,e.target.result);
        }
        reader.readAsDataURL(file);
    }
}




