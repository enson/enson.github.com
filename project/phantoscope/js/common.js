/**
 * User: xijian.py
 * Date: 12-10-30
 * Time: 下午1:05
 * Description: 万花筒所有页面通用交互逻辑
 */


/****************begin 步骤进度条切换逻辑*******************/
YUI().use('node','event','node-event-delegate',function(Y){
    var status = Y.one('.appStatus').get('value');
    if(status <= 4){
        Y.one('.tab1 img').setAttribute('src','./img/common/designTab.PNG');
        Y.one('.tab2 img').setAttribute('src','./img/common/editTab.PNG');
        Y.one('.tab3 img').setAttribute('src','./img/common/deployTab.PNG');

        Y.all('.scheduleBar').setStyle('background-color','#fff');
        Y.all('.status-text').setContent('未开始');
        Y.all('.done-icon').setStyle('display','none');
        if(status == 0){
            Y.all('.scheduleBar').setStyle('background-color','#fff');
            Y.all('.status-text').setContent('未开始');
            Y.all('.done-icon').setStyle('display','none');
        }else if(status == 1){
            Y.all('.status-logo .scheduleBar').setStyle('background-color','#82c32e');
            Y.one('.status-logo .status-text').setContent('已完成');
            Y.one('.status-logo .done-icon').setStyle('display','inline-block');
        }else if(status == 2){
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
    }

    if(status > 4 && status < 8){
        Y.one('.tab1 img').setAttribute('src','./img/common/designTab2.PNG');
        Y.one('.tab1 a').setAttribute('href','./design-appearance.html');
        Y.one('.tab2 img').setAttribute('src','./img/common/editTab3.PNG');
        Y.one('.tab2 a').setAttribute('href','./edit-homepage.html');
        Y.one('.tab3 img').setAttribute('src','./img/common/deployTab.PNG');

        Y.one('.tab1 img').on('click',function(){
            Y.one('.tab1 img').setAttribute('src','./img/common/designTab.PNG');
            Y.one('.tab2 img').setAttribute('src','./img/common/editTab2.PNG');
        })

        Y.all('.scheduleBar').setStyle('background-color','#fff');
        Y.all('.status-text').setContent('未开始');
        Y.all('.done-icon').setStyle('display','none');

        if(status == 5){
            Y.all('.status-homepage .scheduleBar').setStyle('background-color','#82c32e');
            Y.one('.status-homepage .status-text').setContent('已完成');
            Y.one('.status-homepage .done-icon').setStyle('display','inline-block');
        }else if(status == 6){
            Y.all('.status-homepage .scheduleBar').setStyle('background-color','#82c32e');
            Y.all('.status-channel .scheduleBar').setStyle('background-color','#82c32e');
            Y.one('.status-homepage .status-text').setContent('已完成');
            Y.one('.status-channel .status-text').setContent('已完成');
            Y.one('.status-homepage .done-icon').setStyle('display','inline-block');
            Y.one('.status-channel .done-icon').setStyle('display','inline-block');
        }else if(status == 7){
            Y.all('.scheduleBar').setStyle('background-color','#82c32e');
            Y.all('.status-text').setContent('已完成');
            Y.all('.done-icon').setStyle('display','inline-block');

            Y.one('.nextStepDeploy img').setAttribute('src','./img/edit/next_step2.png');
        }
    }
    if(status > 7){
        Y.one('.tab1 img').setAttribute('src','./img/common/designTab2.PNG');
        Y.one('.tab1 a').setAttribute('href','./design-appearance.html');
        Y.one('.tab2 img').setAttribute('src','./img/common/editTab2.PNG');
        Y.one('.tab2 a').setAttribute('href','./edit-homepage.html');
        Y.one('.tab3 img').setAttribute('src','./img/common/deployTab2.PNG');
        Y.one('.tab3 a').setAttribute('href','./deploy-packing.html');


        if(status == 8){
            Y.one('.packing-tip .text1').setStyle('display','block');
            Y.one('.packing-tip .text2').setStyle('display','none');
        }else if(status == 10){
            Y.one('.packing-tip .text1').setStyle('display','none');
            Y.one('.packing-tip .text2').setStyle('display','block');
        }

    }


})



/****************end 步骤进度条切换逻辑********************/