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
            Y.one('.input_name').set('value',inputVal.substring(0,12));
        }
    })

    Y.one('.nextStep img').on('click',function(e){
        if(Y.one('.num-right img').getStyle('display') == 'inline-block'
            && Y.one('.name-right img').getStyle('display') == 'inline-block'
            && Y.one('.done-icon1').getStyle('display') == 'inline-block'
            && Y.one('.done-icon2').getStyle('display') == 'inline-block'
            && Y.one('.done-icon3').getStyle('display') == 'inline-block'){
            alert('h');
        }else{
            e.halt();
            alert('亲，您还没有编辑完成哦！');
            if(Y.one('.num-right img').getStyle('display') == 'none'){
                Y.one('.num-warning').setStyle('display','inline-block');
            }
            if(Y.one('.name-right img').getStyle('display') == 'none'){
                Y.one('.name-warning').setStyle('display','inline-block');
            }


        }
    })

})
