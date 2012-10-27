/**
 * Author: xijian.py
 * Date: 12-10-11
 * Time: 下午7:03
 * Description:内容编辑-客户端频道页面的交互逻辑
 */
YUI().use('node','node-event-delegate','jsonp',function(Y){
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
            Y.one('#channel-store-item').setStyle('display','none');
        }else if(nChannelLinkSelect.get('selectedIndex') == 2){
            Y.one('.channel-keyword').setStyle('display','none');
            Y.one('#channel-store-item').setStyle('display','block');
            transferBB(Y.one('#channel-store-item .box-left'),Y.one('#channel-store-item .box-right'),
                Y.one('#channel-store-item .add-transfer-button'),Y.one('#channel-store-item .add-transfer-button2'));
            importCate();
        }else if(nChannelLinkSelect.get('selectedIndex') == 3){
            Y.one('.channel-keyword').setStyle('display','block');
            Y.one('#channel-store-item').setStyle('display','block');
            transferBB(Y.one('#channel-store-item2 .box-left'),Y.one('#channel-store-item2 .box-right'),
                Y.one('#channel-store-item2 .add-transfer-button'),Y.one('#channel-store-item2 .add-transfer-button2'));
            importCate();
        }else if(nChannelLinkSelect.get('selectedIndex') == 0){
            Y.one('.channel-keyword').setStyle('display','none');
            Y.one('#channel-store-item').setStyle('display','none');
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

    //店铺类目数据引入
    function importCate(){
        var catUrl = './catData.jsonp?'+
            '&callback=importCat';
        window.importCat = function(data){
            var items = data.cats,len = items.length;
            var itemsList = '';
            for(var i=0;i < len;i++){
                itemsList += '<li class="item-sub" title="'+items[i].id+'">'+items[i].name+'</li>';
                var subCat = items[i].subCats;
                for(var j=0;j< subCat.length;j++){
                    itemsList += '<li class="item-sub" title="'+subCat[j].id+'">'+subCat[j].name+'</li>';
                }
            }
            Y.one('.box-left').setContent(itemsList);
        }
        Y.jsonp(catUrl,importCat);
    };

    //频道--店铺类目框功能
    /*
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
    */


    function transferBB(nLeft,nRight,nAddBtn,nOutBtn){
        nLeft.delegate('click',function(){
            Y.all('.box-left .item-sub').removeClass('item-sub-focus');
            this.addClass('item-sub-focus');
        },'.item-sub');
        nLeft.delegate('dblclick',function(){
            move(nLeft,nRight);
        },'.item-sub');
        nRight.delegate('click',function(){
            Y.all('.box-right .item-sub').removeClass('item-sub-focus');
            this.addClass('item-sub-focus');
        },'.item-sub');
        nRight.delegate('dblclick',function(){
            move(nRight,nLeft);
        },'.item-sub');

        function move(src,des){
            var nItemListArray = src.all('.item-sub');
            for(var i=0;i < nItemListArray.size();i++){
                if(nItemListArray.item(i).hasClass('item-sub-focus')){
                    nItemListArray.item(i).removeClass('item-sub-focus');
                    des.append(nItemListArray.item(i--));
                    break;
                }
            }
        };
        nAddBtn.on('click',function(){
            move(nLeft,nRight);
        });
        nOutBtn.on('click',function(){
            move(nRight,nLeft);
        });
    };

    //频道list上下移动功能函数
    function shiftLi(nList){
        nList.delegate('click',function(){
            var getList=function(){
                return nList.all('li');
            };
            var nListArray = getList();
            for(var i=0; i<nListArray.size(); i++){
                if(this.ancestor('li') == nListArray.item(i)){
                    var prevItem = nListArray.item(i-1);
                    //nAdList.insertBefore( nAdListArray.item(i), prevAdItem);
                    prevItem.insert(nListArray.item(i),'before');
                    break;
                }
            }
        },'.item-shift-up2');
        nList.delegate('click',function(){
            var getList=function(){
                return nList.all('li');
            };
            var nListArray = getList();
            for(var i=0; i<nListArray.size(); i++){
                if(this.ancestor('li') == nListArray.item(i)){
                    var nextItem = nListArray.item(i+1);
                    //nAdList.insertBefore( nAdListArray.item(i), prevAdItem);
                    nListArray.item(i).insert(nextItem,'before');
                    break;
                }
            }
        },'.item-shift-down2');
    };

    window.onload = function(){
        shiftLi(nChannelList);
    };


});