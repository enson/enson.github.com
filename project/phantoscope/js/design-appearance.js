/**
 * User: xijian.py
 * Date: 12-10-29
 * Time: 下午4:02
 * Description:外观设计进度显示页面交互逻辑
 */
YUI().use('node','event','node-event-delegate',function(Y){
    Y.one('.input_num').on('change',function(){
        if (/[^\d]/.test(this.get('value')) || !this.get('value') ){
            Y.one('.num-warning').setStyle('display','inline-block');
            Y.one('.num-right img').setStyle('display','none');
        }else if(!/[^\d]/.test(this.get('value')) && this.get('value')){
            Y.one('.num-warning').setStyle('display','none');
            Y.one('.num-right img').setStyle('display','inline-block');
        }
    })

    window.onload = function(){

    }

    Y.one('.input_name').on('change',function(){
        var inputVal = Y.one('.input_name').get('value');
        var codeMatch = inputVal.match(/[a-zA-Z0-9]/g);
        var charMatch = inputVal.match(/[\u4e00-\u9fa5]/g);
        var codeNum = codeMatch ? codeMatch.length : 0;
        var charNum = charMatch ? charMatch.length : 0;
        var length = codeNum + 2*charNum;

        if(this.get('value') && length <= 12){
            Y.one('.name-right img').setStyle('display','inline-block');
            Y.one('.name-warning').setStyle('display','none');
        }else if(!this.get('value') || length > 12){
            Y.one('.name-right img').setStyle('display','none');
            Y.one('.name-warning').setStyle('display','inline-block');
        }

    })

})
