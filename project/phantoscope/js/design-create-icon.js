/**
 * User: xijian.py
 * Date: 12-10-18
 * Time: 下午2:42
 * Description:外观设计--创建图表页面交互逻辑
 */
YUI().use('node','node-event-delegate',function(Y){
    var nColorList = Y.one('.bgcolor');
    var nSelectSize = Y.one('.selectSize');
    var nPreviewBtn = Y.one('.preview-btn');


    nColorList.delegate('click',function(){
        Y.all('.selectC').setStyle('border','5px solid transparent');
        this.setStyle('border','5px solid #ff6600');
        Y.all('.sizeBox').setStyle('background-color',this.getStyle('background-color'));
    },'.selectC')
    nSelectSize.delegate("click",function(){
        Y.all('.sizeItem').setStyle('border','3px solid gainsboro');
        this.setStyle('border','3px solid #ff6600');
    },'.sizeItem')


    //预览图标功能
    nPreviewBtn.on('click',function(){
        var directory = Y.one('.txt').get('value');
        alert(directory);
        Y.all('.sizeBox img').setAttribute('src',directory);
    })

});
