/**
 * Author: xijian.py
 * Date: 12-9-27
 * Time: 下午3:56
 * Description:内容编辑页面的JS交互逻辑
 */

YUI().use('node','node-event-delegate',function(Y){
    var nAddButton = Y.one('#add_ad_button');
    var nCancelButton = Y.one('#cancel-button');
    var nLinkSelect = Y.one('#add-link-select');
    var nAdList = Y.one('#ad-list');
    var nAddAdButton = Y.one('#add-ad-button');
    var nSave = Y.one('#save-button');
    var nAdListArray = nAdList.all('.ad-item');
    var nAdArrayLength = nAdListArray.get('length').length;
    Y.log(nAdListArray.size());
    Y.log(nAdListArray.item(0));
    Y.log(nAdListArray.get('length').length);
    Y.log(nAdListArray.item(nAdArrayLength-1));


    nAddButton.on('click',function(){
        checkAdAmount();
    });
    nCancelButton.on('click',function(){
        Y.one('#ad-list').setStyle('display','block');
        Y.one('#add-ad').setStyle('display','none');
        nAddButton.setStyle('display','block');
        nSave.setStyle('display','block');
    });
    //选择不同的添加链接控制不同部分的显示
    function linkSelect(){
        if(nLinkSelect.get('selectedIndex') == 1){
            Y.one('#store-product').setStyle('display','block');
            Y.one('#keyword-input').setStyle('display','none');
            Y.one('#store-item').setStyle('display','none');
            Y.one('#store-keyword-search').setStyle('display','none');
        }else if(nLinkSelect.get('selectedIndex') == 2){
            Y.one('#store-product').setStyle('display','none');
            Y.one('#keyword-input').setStyle('display','block');
            Y.one('#store-item').setStyle('display','none');
            Y.one('#store-keyword-search').setStyle('display','none');
        }else if(nLinkSelect.get('selectedIndex') == 3){
            Y.one('#store-product').setStyle('display','none');
            Y.one('#keyword-input').setStyle('display','none');
            Y.one('#store-item').setStyle('display','block');
            Y.one('#store-keyword-search').setStyle('display','none');
        }else if(nLinkSelect.get('selectedIndex') == 4){
            Y.one('#store-product').setStyle('display','none');
            Y.one('#keyword-input').setStyle('display','none');
            Y.one('#store-item').setStyle('display','none');
            Y.one('#store-keyword-search').setStyle('display','block');
        }
    };
    nLinkSelect.on('click',function(){
        linkSelect();
    });
    //点击删除广告list中各广告
    nAdList.delegate('click',function(){
        this.ancestor('li').remove();
    },'button');

    //点击添加按钮添加广告list中的广告
    function addAd(){
        nAdList.append(
            '<li class="ad-item">'+
                '<div class="ad-item-pic"><img src="./img/edit/ad_item_pic1.PNG" /></div>'+
            '<div class="ad-item-button">'+
                '<img src="./img/edit/check-link.PNG" />'+
                '<img src="./img/edit/edit.PNG" />'+
                '<button><img src="./img/edit/delete.PNG" /></button>'+
            '</div>'+
            '<div class="ad-item-shift">'+
                '<div class="item-shift-box">'+
                    '<div class="item-shift-up2"></div>'+
                '</div>'+
                '<div class="item-shift-box">'+
                    '<div class="item-shift-down2"></div>'+
                '</div>'+
            '</div>'+
        '</li>'
        );
    };
    nAddAdButton.on('click',function(){
        addAd();
        Y.one('#ad-list').setStyle('display','block');
        Y.one('#add-ad').setStyle('display','none');
        nSave.setStyle('display','block');
        nAddButton.setStyle('display','block');
    });
    //判断广告图片数量，继而执行添加广告功能
    function checkAdAmount(){
        if(nAdArrayLength > 4){
            alert("亲，最多可以添加5张图片哟！");
        }else{
            Y.one('#ad-list').setStyle('display','none');
            Y.one('#add-ad').setStyle('display','block');
            nSave.setStyle('display','none');
            nAddButton.setStyle('display','none');
        }
    };
    //上下移动的图标变化
    /*
    function shiftIcon(){
        for(var i= 0;i < nAdArrayLength;i++){
            var t = nAdListArray.item(i);
            if(t && t ==nAdListArray.item(0)){

            }
        }
        nAdListArray.item(0)
    }
    */
    nAdList.delegate('click',function(){
        this.ancestor('li').remove();

    },'.item-shift-up2');

});

