/**
 * User: xijian.py
 * Date: 12-10-29
 * Time: 下午4:02
 * Description:外观设计进度显示页面交互逻辑
 */
YUI().use('node','event','node-event-delegate',function(Y){
    var status = Y.one('.stepStatus').get('value');
    if(status == 0){
        Y.all('.scheduleBar').setStyle('background-color','#fff');
        Y.all('.status-text').setContent('未开始');
        Y.all('.done-icon').setStyle('display','none');
    }else if(status == 1){
        Y.all('.scheduleBar').setStyle('background-color','#fff');
        Y.all('.status-text').setContent('未开始');
        Y.all('.done-icon').setStyle('display','none');
        Y.all('.status-logo .scheduleBar').setStyle('background-color','#82c32e');
        Y.one('.status-logo .status-text').setContent('已完成');
        Y.one('.status-logo .done-icon').setStyle('display','inline-block');
    }else if(status == 2){
        Y.all('.scheduleBar').setStyle('background-color','#fff');
        Y.all('.status-text').setContent('未开始');
        Y.all('.done-icon').setStyle('display','none');
        Y.all('.status-logo .scheduleBar').setStyle('background-color','#82c32e');
        Y.all('.status-welcome .scheduleBar').setStyle('background-color','#82c32e');
        Y.one('.status-logo .status-text').setContent('已完成');
        Y.one('.status-welcome .status-text').setContent('已完成');
        Y.one('.status-logo .done-icon').setStyle('display','inline-block');
        Y.one('.status-welcome .done-icon').setStyle('display','inline-block');
    }else if(status == 3){
        Y.all('.scheduleBar').setStyle('background-color','#82c32e');
        Y.all('.status-text').setContent('已完成');
        Y.all('.done-icon').setStyle('display','inline-block');
    }else if(status == 4){
        Y.all('.scheduleBar').setStyle('background-color','#82c32e');
        Y.all('.status-text').setContent('已完成');
        Y.all('.done-icon').setStyle('display','inline-block');
        Y.one('.nextStep img').setAttribute('src','./img/common/nextStep2.PNG');
    }
})
