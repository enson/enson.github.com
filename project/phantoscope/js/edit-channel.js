/**
 * Author: xijian.py
 * Date: 12-10-11
 * Time: 下午7:03
 * Description:内容编辑-客户端频道页面的交互逻辑
 */
YUI().use('node','node-event-delegate',function(Y){
    var nAddChannel = Y.one('#add_channel_button');
    var nChannelList = Y.one('#channel-list');
    var nEditChannel = Y.one('.edit-channel');

    var nChannelLinkSelect = Y.one('#channel-link-select');
    var nCancelChannel = Y.one('#cancel-channel-button');
    var nAddChannelBtn = Y.one('#add-channel-button');

    var getCList = function(){
        return nChannelList.all('.channel-item');
    };
    var nCListArray = getCList();

    var nLeftBox = Y.one('.leftSel');
    var nRightBox = Y.one('.rightSel');
    var nLeftBox2 = Y.one('.leftSel2');
    var nRightBox2 = Y.one('.rightSel2');

    //删除频道功能
    nChannelList.delegate('click',function(){
        this.ancestor('.channel-item').remove();
    },'.deleteChannel');

    //频道-编辑按钮功能
    nChannelList.delegate('click',function(){
        nAddChannel.setStyle('display','none');
        nChannelList.setStyle('display','none');
        nEditChannel.setStyle('display','block');
    },'.editChannel');

    //点击添加频道按钮
    nAddChannel.on('click',function(){
        checkChannelNum();
    });
    function checkChannelNum(){
        nCListArray = getCList();
        if(nCListArray.size() > 9){
            alert("亲，最多添加10个频道哦！");
        }else{
            nAddChannel.setStyle('display','none');
            nChannelList.setStyle('display','none');
            nEditChannel.setStyle('display','block');
        }
    }

    //频道编辑-点击不同链接切换显隐
    function channelLinkSelect(){
        if(nChannelLinkSelect.get('selectedIndex') == 1){
            Y.one('.channel-keyword').setStyle('display','block');
            Y.one('.channel-store-item').setStyle('display','none');
            Y.one('.channel-store-keyword').setStyle('display','none');
            Y.one('#add-channel-button').setStyle('display','inline-block');
            Y.one('#cancel-channel-button').setStyle('display','inline-block');
        }else if(nChannelLinkSelect.get('selectedIndex') == 2){
            Y.one('.channel-keyword').setStyle('display','none');
            Y.one('.channel-store-item').setStyle('display','block');
            Y.one('.channel-store-keyword').setStyle('display','none');
            Y.one('#add-channel-button').setStyle('display','inline-block');
            Y.one('#cancel-channel-button').setStyle('display','inline-block');
        }else if(nChannelLinkSelect.get('selectedIndex') == 3){
            Y.one('.channel-keyword').setStyle('display','none');
            Y.one('.channel-store-item').setStyle('display','none');
            Y.one('.channel-store-keyword').setStyle('display','block');
            Y.one('#add-channel-button').setStyle('display','inline-block');
            Y.one('#cancel-channel-button').setStyle('display','inline-block');
        }else if(nChannelLinkSelect.get('selectedIndex') == 0){
            Y.one('.channel-keyword').setStyle('display','none');
            Y.one('.channel-store-item').setStyle('display','none');
            Y.one('.channel-store-keyword').setStyle('display','none');
            Y.one('#add-channel-button').setStyle('display','none');
            Y.one('#cancel-channel-button').setStyle('display','none');
        }
    }
    nChannelLinkSelect.on('click',function(){
        channelLinkSelect();
    });
    //取消添加，添加按钮事件
    nCancelChannel.on('click',function(){
        nAddChannel.setStyle('display','block');
        nChannelList.setStyle('display','block');
        nEditChannel.setStyle('display','none');
    });
    nAddChannelBtn.on('click',function(){
        addChannelItem();
        nAddChannel.setStyle('display','block');
        nChannelList.setStyle('display','block');
        nEditChannel.setStyle('display','none');
    });
    function addChannelItem(){
        var channelTitle = Y.one('#channel-title-input').get('value');
        nChannelList.append(
            '<li class="channel-item">'+
                '<div class="channel-item-text">'+channelTitle+'</div>'+
                '<div class="channel-item-button">'+
                    '<img src="./img/edit/check-link.PNG" />'+
                    '<button class="editChannel"><img src="./img/edit/edit.PNG" /></button>'+
                    '<button class="deleteChannel"><img src="./img/edit/delete.PNG" /></button>'+
                '</div>'+
                '<div class="channel-item-shift">'+
                    '<div class="item-shift-box">'+
                        '<div class="item-shift-up2"></div>'+
                    '</div>'+
                    '<div class="item-shift-box">'+
                        '<div class="item-shift-down2"></div>'+
                    '</div>'+
                '</div>'+
            '</li>'
        );
        nCListArray = getCList();
        Y.all('.channel-item-button img').setStyle('margin-right','5px');
    }

    //频道--店铺类目框功能
    function moveRight(src,des){
        if(src.get('selectedIndex') == -1){
            alert("亲，你还没有选择类目哦!");
            return;
        }
        for(var i=0;i<src.get('length');i++){
            if(src.get('children').item(i).get('selected')){
                des.append(src.get('children').item(i--));
            }
        }
    }
    Y.one('.add-transfer-button').on('click',function(){
        moveRight(nLeftBox,nRightBox);
    });
    Y.one('.out-transfer-button').on('click',function(){
        moveRight(nRightBox,nLeftBox);
    });

    Y.one('.add-transfer-button2').on('click',function(){
        moveRight(nLeftBox2,nRightBox2);
    })
    Y.one('.out-transfer-button2').on('click',function(){
        moveRight(nRightBox2,nLeftBox2);
    });



});