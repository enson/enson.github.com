/**
 * User: xijian.py
 * Date: 12-10-17
 * Time: 上午10:07
 * Description:发布客户端-预览包页面交互逻辑
 */
YUI().use('node','overlay',function(Y){
    var overlay = new Y.Overlay({
        srcNode:"#iPhone-preview-tip",
        centered:true,
        zIndex:100,
        visible:true
    })
    Y.one('.iPhone-preview-btn').on('click',function(){
        overlay.render();
        Y.one('#iPhone-preview-tip').setStyle('display','block');
        Y.one('.mask-overlay').setStyle('display','block');
    })
    Y.one('.tip-cancel').on('click',function(){
        Y.one('#iPhone-preview-tip').setStyle('display','none');
        Y.one('.mask-overlay').setStyle('display','none');
    })
    Y.one('.tip-go-download').on('click',function(){
        Y.one('#iPhone-preview-tip').setStyle('display','none');
        Y.one('.mask-overlay').setStyle('display','none');
    })

});
