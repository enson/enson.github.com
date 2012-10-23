/**
 * User: xijian.py
 * Date: 12-10-23
 * Time: 下午4:27
 * Description:
 */
YUI().use('node','event','node-base','node-event-delegate','jsonp',function(Y){
    Y.one('.add-app-btn').on('click',function(){
        Y.one('.mask-overlay').setStyle('display','block');
        Y.one('.app-id-dialog').setStyle('display','block');
    })
    Y.one('.app-btn .confirm').on('click',function(){
        Y.one('.mask-overlay').setStyle('display','none');
        Y.one('.app-id-dialog').setStyle('display','none');
    })
    Y.one('.app-btn .back').on('click',function(){
        Y.one('.mask-overlay').setStyle('display','none');
        Y.one('.app-id-dialog').setStyle('display','none');
    })

})
