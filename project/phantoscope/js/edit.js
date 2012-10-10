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
    var nAdSave = Y.one('#ad-save');
    var getAdList=function(){
        return nAdList.all('.ad-item');
    };
    var nAdListArray = getAdList();
    var nAdListArray2 = nAdListArray.get('length');
    var nAdArrayLength = nAdListArray.get('length').length;
    //Y.log(nAdListArray.size());
    //Y.log(nAdListArray.item(0));
    //Y.log(nAdListArray.item(nAdArrayLength-1));
    //Y.log(nAdListArray.get('length').length);
    //Y.log(nAdListArray);
    //Y.log(nAdListArray.get('length'));
    //Y.log(nAdListArray2[0]);

    var nBoxLeft = Y.one('#box-left');
    var nBoxRight = Y.one('#box-right');
    var nAddTransferBtn = Y.one('#add-transfer-button');
    var nOutTransferBtn = Y.one('#out-transfer-button');

    var nPAd = Y.one('#P_ad');
    var nPBox = Y.one('#P_box');
    var nAdPos = Y.one('#ad-pos');
    var n3Sub = Y.one('#ThreeSubject');
    var nSubList = Y.one('#sub-list');
    var nSubSave = Y.one('#sub-save');

    var nEditSub = Y.one('#edit-sub');
    var nSubLinkSelect = Y.one('#sub-link-select');
    var nCancelSub = Y.one('#cancel-sub-button');
    var nAddSub = Y.one('#add-sub-button');

    //判断广告图片数量，继而执行进入添加广告功能页面
    function checkAdAmount(){
        nAdListArray = getAdList();
        if(nAdListArray.size() > 4){
            alert("亲，最多可以添加5张图片哟！");
        }else{
            Y.one('#ad-list').setStyle('display','none');
            Y.one('#add-ad').setStyle('display','block');
            nAdSave.setStyle('display','none');
            nAddButton.setStyle('display','none');
        }
    };
    //右上角添加广告按钮绑定事件
    nAddButton.on('click',function(){
        checkAdAmount();
    });

    //点击删除广告list中各广告
    nAdList.delegate('click',function(){
        this.ancestor('.ad-item').remove();
    },'.deleteAd');

    nCancelButton.on('click',function(){
        Y.one('#ad-list').setStyle('display','block');
        Y.one('#add-ad').setStyle('display','none');
        nAddButton.setStyle('display','block');
        nAdSave.setStyle('display','block');
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


    //点击添加按钮添加广告list中的广告
    function addAd(){
        nAdList.append(
            '<li class="ad-item">'+
                '<div class="ad-item-pic"><img src="./img/edit/phone_ad.PNG" /></div>'+
                '<div class="ad-item-button">'+
                    '<img src="./img/edit/check-link.PNG" />'+
                    '<img src="./img/edit/edit.PNG" />'+
                    '<button class="deleteAd"><img src="./img/edit/delete.PNG" /></button>'+
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
        nAdListArray = getAdList();
    };
    nAddAdButton.on('click',function(){
        addAd();
        Y.one('#ad-list').setStyle('display','block');
        Y.one('#add-ad').setStyle('display','none');
        nAdSave.setStyle('display','block');
        nAddButton.setStyle('display','block');
    });

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
    //各广告上下移动
    nAdList.delegate('click',function(){
        for(var i=0; i<nAdListArray.size(); i++){
            if(this.ancestor('.ad-item') == nAdListArray.item(i)){
                var prevAdItem = nAdListArray.item(i-1);
                nAdList.insertBefore( nAdListArray.item(i), prevAdItem);
                break;
            }
        }
        Y.log(nAdListArray.size());
    },'.item-shift-up2');

    //店铺宝贝框添加移除功能
    nBoxLeft.delegate('click',function(){
        this.ancestor('.item-sub').addClass('item-sub-focus');
    },'.item-sub-dscptn');
    nBoxLeft.delegate('dblclick',function(){
        this.ancestor('.item-sub').removeClass('item-sub-focus');
    },'.item-sub-dscptn');
    nBoxRight.delegate('click',function(){
        this.ancestor('.item-sub').removeClass('item-sub-focus');
    },'.item-sub-dscptn');
    nBoxRight.delegate('dblclick',function(){
        this.ancestor('.item-sub').addClass('item-sub-focus');
    },'.item-sub-dscptn');

    function move(src,des){
        var nItemListArray = src.all('.item-sub');
        for(var i=0;i < nItemListArray.size();i++){
            if(nItemListArray.item(i).hasClass('item-sub-focus')){
                des.append(nItemListArray.item(i--));
                break;
            }
        }
    }
    nAddTransferBtn.on('click',function(){
        move(nBoxLeft,nBoxRight);
    });
    nOutTransferBtn.on('click',function(){
        move(nBoxRight,nBoxLeft);
    });

    //不同功能模块的显隐切换
    nPAd.on('click',function(){
        nAdPos.setStyle('display','block');
        nPAd.setStyle('border','2px solid #ff6600');
        nPBox.all('.item-title').setStyle('border','1px solid gainsboro');
        n3Sub.setStyle('display','none');
    });
    nPBox.delegate('click',function(){
        nPBox.all('.item-title').setStyle('border','2px solid #ff6600');
        nPAd.setStyle('border','none');
        nAdPos.setStyle('display','none');
        n3Sub.setStyle('display','block');
    },'.item-title');

    //专题删除功能
    nSubList.delegate('click',function(){
        this.ancestor('.sub-item').remove();
    },'.deleteSub')

    //专题编辑功能
    nSubList.delegate('click',function(){
        nSubList.setStyle('display','none');
        nSubSave.setStyle('display','none');
        nEditSub.setStyle('display','block');
    },'.editSub')

    nCancelSub.on('click',function(){
        nSubList.setStyle('display','block');
        nSubSave.setStyle('display','block');
        nEditSub.setStyle('display','none');
    })
    nAddSub.on('click',function(){
        addSub();
    })
    function addSub(){
        var subTitle = Y.one('#sub-title-input').get('value');
        Y.all('.sub-item-text').setContent(subTitle);
        //this.ancestor('.sub-item-text').setContent(subTitle);
        nSubList.setStyle('display','block');
        nSubSave.setStyle('display','block');
        nEditSub.setStyle('display','none');
    }


    //专题链接选择显隐切换功能
    function subLinkSelect(){
        if(nSubLinkSelect.get('selectedIndex') == 1){
            Y.one('#sub-keyword').setStyle('display','block');
            Y.one('#sub-store-item').setStyle('display','none');
            Y.one('#sub-store-keyword').setStyle('display','none');
            Y.one('#add-sub-button').setStyle('display','inline-block');
            Y.one('#cancel-sub-button').setStyle('display','inline-block');
        }else if(nSubLinkSelect.get('selectedIndex') == 2){
            Y.one('#sub-keyword').setStyle('display','none');
            Y.one('#sub-store-item').setStyle('display','block');
            Y.one('#sub-store-keyword').setStyle('display','none');
            Y.one('#add-sub-button').setStyle('display','inline-block');
            Y.one('#cancel-sub-button').setStyle('display','inline-block');
        }else if(nSubLinkSelect.get('selectedIndex') == 3){
            Y.one('#sub-keyword').setStyle('display','none');
            Y.one('#sub-store-item').setStyle('display','none');
            Y.one('#sub-store-keyword').setStyle('display','block');
            Y.one('#add-sub-button').setStyle('display','inline-block');
            Y.one('#cancel-sub-button').setStyle('display','inline-block');
        }else if(nSubLinkSelect.get('selectedIndex') == 0){
            Y.one('#sub-keyword').setStyle('display','none');
            Y.one('#sub-store-item').setStyle('display','none');
            Y.one('#sub-store-keyword').setStyle('display','none');
            Y.one('#add-sub-button').setStyle('display','none');
            Y.one('#cancel-sub-button').setStyle('display','none');
        }
    }
    nSubLinkSelect.on('click',function(){
        subLinkSelect();
    })




});

