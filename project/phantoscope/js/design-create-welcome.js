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

    //上传logo点击预览
    nLogoPreview.on('click',function(){
        var directory = Y.one('.txt').get('value');
        if(directory){
            Y.all('.logo img').setAttribute('src',directory);
        }else{
            alert("亲，你还没有上传图片哦！");
        }
    })

    //点击添加宝贝图片
    Y.one('.addItem').delegate('change',function(){
        var img = '<img src="'+this.get('value')+'"/>';
        var btnChange = '<img src="./img/design/edit.PNG" />';
        this.previous('.addBox').setContent(img);
        this.previous('.editButton').setContent(btnChange);
    },'.addBox-file')
    //点击预览宝贝图片
    nPicPreview.on('click',function(){
        if(Y.one('.addBox1').hasChild('img')){
            Y.all('.pic-box1 img').setAttribute('src', Y.one('.addBox1 img').getAttribute('src'));
        }else{
            alert('亲，你还没有上传图片哦！');
        }
    })


});