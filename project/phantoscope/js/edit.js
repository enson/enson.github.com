/**
 * Author: xijian.py
 * Date: 12-9-27
 * Time: 下午3:56
 * Description:内容编辑页面的JS交互逻辑
 */

YUI().use('node','event','dd','node-base','node-event-delegate','jsonp',function(Y){
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

    var nBoxLeft = Y.one('.box-left');
    var nBoxRight = Y.one('.box-right');
    var nAddTransferBtn = Y.one('.add-transfer-button');
    var nOutTransferBtn = Y.one('.out-transfer-button');

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

    var nSixBb = Y.one('#six-bb');
    var nImportBb = Y.one('#import-button');
    var nBbList = Y.one('#bb-list');
    var nBbAdd = Y.one('#bb-add-button');
    var nBbCancel = Y.one('#bb-cancel-button');

    var nPNewBb = Y.one('#P_new_bb');
    var nUpdateBb = Y.one('.update-bb');
    var nPHot = Y.one('#P_hot_bb');

    var nHotSell = Y.one('.hot-sell');
    var nHotStoreBb = Y.one('#hot-store-product');



    window.onload = function(){
        if(1 == 1){
            nAdPos.setStyle('display','block');
            nPAd.setStyle('border','2px solid #ff6600');
            nPBox.all('.item-title').setStyle('border','1px solid gainsboro');
            nPBox.all('.item-bb').setStyle('border','1px solid gainsboro');
            nPNewBb.setStyle('border','2px solid #fff');
            nPHot.setStyle('border','2px solid #fff');
            n3Sub.setStyle('display','none');
            nSixBb.setStyle('display','none');
            nUpdateBb.setStyle('display','none');
            nHotSell.setStyle('display','none');
        };
    };

    //不同功能模块的显隐切换
    nPAd.on('click',function(){
        nAdPos.setStyle('display','block');
        nPAd.setStyle('border','2px solid #ff6600');
        nPBox.all('.item-title').setStyle('border','1px solid gainsboro');
        nPBox.all('.item-bb').setStyle('border','1px solid gainsboro');
        nPNewBb.setStyle('border','2px solid #fff');
        nPHot.setStyle('border','2px solid #fff');
        n3Sub.setStyle('display','none');
        nSixBb.setStyle('display','none');
        nUpdateBb.setStyle('display','none');
        nHotSell.setStyle('display','none');
        shiftLi(nAdList);
    });
    nPBox.delegate('click',function(){
        nPBox.all('.item-title').setStyle('border','2px solid #ff6600');
        nPBox.all('.item-bb').setStyle('border','1px solid gainsboro');
        nPAd.setStyle('border','none');
        nPNewBb.setStyle('border','2px solid #fff');
        nPHot.setStyle('border','2px solid #fff');
        nAdPos.setStyle('display','none');
        n3Sub.setStyle('display','block');
        nSixBb.setStyle('display','none');
        nUpdateBb.setStyle('display','none');
        nHotSell.setStyle('display','none');
    },'.item-title');
    nPBox.delegate('click',function(){
        nPBox.all('.item-bb').setStyle('border','2px solid #ff6600');
        nPBox.all('.item-title').setStyle('border','1px solid gainsboro');
        nPAd.setStyle('border','none');
        nPNewBb.setStyle('border','2px solid #fff');
        nPHot.setStyle('border','2px solid #fff');
        nAdPos.setStyle('display','none');
        n3Sub.setStyle('display','none');
        nSixBb.setStyle('display','block');
        nUpdateBb.setStyle('display','none');
        nHotSell.setStyle('display','none');
        shiftLi(nBbList);
    },'.item-bb');
    nPNewBb.on('click',function(){
        nPNewBb.setStyle('border','2px solid #ff6600');
        nPBox.all('.item-title').setStyle('border','1px solid gainsboro');
        nPBox.all('.item-bb').setStyle('border','1px solid gainsboro');
        nPAd.setStyle('border','none');
        nPHot.setStyle('border','2px solid #fff');
        nAdPos.setStyle('display','none');
        n3Sub.setStyle('display','none');
        nSixBb.setStyle('display','none');
        nUpdateBb.setStyle('display','block');
        nHotSell.setStyle('display','none');
    });
    nPHot.on('click',function(){
        nPNewBb.setStyle('border','2px solid #fff');
        nPBox.all('.item-title').setStyle('border','1px solid gainsboro');
        nPBox.all('.item-bb').setStyle('border','1px solid gainsboro');
        nPAd.setStyle('border','none');
        nPHot.setStyle('border','2px solid #ff6600');
        nAdPos.setStyle('display','none');
        n3Sub.setStyle('display','none');
        nSixBb.setStyle('display','none');
        nUpdateBb.setStyle('display','none');
        nHotSell.setStyle('display','block');
    })

    //鼠标移上各个图标的浮层提示
    nPAd.on('mouseenter',function(){
        Y.one('.P_ad_mask').setStyle('display','block');
        Y.one('.P_ad_overlay').setStyle('display','block');
    })
    nPAd.on('mouseleave',function(){
        Y.one('.P_ad_mask').setStyle('display','none');
        Y.one('.P_ad_overlay').setStyle('display','none');
    })
    nPBox.delegate('mouseenter',function(){
        Y.all('.item-title .P_box_mask').setStyle('display','block');
        Y.all('.item-title .P_box_overlay').setStyle('display','block');
    },'.item-title');
    nPBox.delegate('mouseleave',function(){
        Y.all('.item-title .P_box_mask').setStyle('display','none');
        Y.all('.item-title .P_box_overlay').setStyle('display','none');
    },'.item-title');
    nPBox.delegate('mouseenter',function(){
        Y.all('.item-bb .P_box_mask').setStyle('display','block');
        Y.all('.item-bb .P_box_overlay').setStyle('display','block');
    },'.item-bb');
    nPBox.delegate('mouseleave',function(){
        Y.all('.item-bb .P_box_mask').setStyle('display','none');
        Y.all('.item-bb .P_box_overlay').setStyle('display','none');
    },'.item-bb');
    nPNewBb.on('mouseenter',function(){
        Y.one('.P_new_mask').setStyle('display','block');
        Y.one('.P_new_overlay').setStyle('display','block');
    })
    nPNewBb.on('mouseleave',function(){
        Y.one('.P_new_mask').setStyle('display','none');
        Y.one('.P_new_overlay').setStyle('display','none');
    })
    nPHot.on('mouseenter',function(){
        Y.one('.P_hot_mask').setStyle('display','block');
        Y.one('.P_hot_overlay').setStyle('display','block');
    })
    nPHot.on('mouseleave',function(){
        Y.one('.P_hot_mask').setStyle('display','none');
        Y.one('.P_hot_overlay').setStyle('display','none');
    })



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

    //各list中li类目上下移动功能函数
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

    /*
    nAdList.delegate('click',function(){
        nAdListArray = getAdList();
        for(var i=0; i<nAdListArray.size(); i++){
            if(this.ancestor('.ad-item') == nAdListArray.item(i)){
                    var prevAdItem = nAdListArray.item(i-1);
                    //nAdList.insertBefore( nAdListArray.item(i), prevAdItem);
                    prevAdItem.insert(nAdListArray.item(i),'before');
                break;
            }
        }
    },'.item-shift-up2');
    nAdList.delegate('click',function(){
        nAdListArray = getAdList();
        for(var i=0; i<nAdListArray.size(); i++){
            if(this.ancestor('.ad-item') == nAdListArray.item(i)){
                var nextAdItem = nAdListArray.item(i+1);
                //nAdList.insertBefore( nAdListArray.item(i), prevAdItem);
                nAdListArray.item(i).insert(nextAdItem,'before');
                break;
            }
        }
    },'.item-shift-down2');
    */

    //点击删除广告list中各广告
    nAdList.delegate('click',function(e){
        this.ancestor('.ad-item').remove();
    },'.deleteAd');
    //店家编辑广告list中的各个广告
    nAdList.delegate('click',function(e){
        Y.one('#ad-list').setStyle('display','none');
        Y.one('#add-ad').setStyle('display','block');
        nAdSave.setStyle('display','none');
        nAddButton.setStyle('display','none');
    },'.editAd');

    nCancelButton.on('click',function(){
        Y.one('#ad-list').setStyle('display','block');
        Y.one('#add-ad').setStyle('display','none');
        nAddButton.setStyle('display','block');
        nAdSave.setStyle('display','block');
    });
    //添加广告-选择不同的添加链接控制不同部分的显示
    function linkSelect(){
        if(nLinkSelect.get('selectedIndex') == 1){
            Y.one('#store-product').setStyle('display','block');
            Y.one('#keyword-input').setStyle('display','none');
            Y.one('#store-item').setStyle('display','none');
            Y.one('#store-keyword-search').setStyle('display','none');
            importBB();
            uniqueTransferBB(nBoxLeft,nBoxRight,nAddTransferBtn,nOutTransferBtn);
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
        }else if(nLinkSelect.get('selectedIndex') == 0){
            Y.one('#store-product').setStyle('display','none');
            Y.one('#keyword-input').setStyle('display','none');
            Y.one('#store-item').setStyle('display','none');
            Y.one('#store-keyword-search').setStyle('display','none');
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
                    '<button class="editAd"><img src="./img/edit/edit.PNG" /></button>'+
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
        //if()
        addAd();
        Y.one('#ad-list').setStyle('display','block');
        Y.one('#add-ad').setStyle('display','none');
        nAdSave.setStyle('display','block');
        nAddButton.setStyle('display','block');
    });

    //店铺宝贝框引入宝贝列表
    function importBB(){
        var url = './data2.jsonp?'+
                  '&callback=method';

        window.method = function(data){
            var items = data.itemsArray,len = items.length;
            var itemList = '';
            for(var i=0;i < len;i++){
                itemList += '<li class="item-sub">'+
                                 '<div class="item-sub-pic"><img src="'+items[i].picUrl+'" /></div>'+
                                 '<div class="item-sub-dscptn">'+
                                 '<div class="title" title="'+items[i].title+'">'+items[i].title+'</div>'+
                                    '<div class="price">￥'+items[i].salePrice+'</div>'+
                                 '</div>'+
                                 '<input type="hidden" value="'+items[i].auctionId+'"/> '+
                            '</li>' ;
            };
            Y.all('.box-left').setContent(itemList);
        }
        Y.jsonp(url, method);
    };


    //店铺宝贝框添加移除功能
    function transferBB(nLeft,nRight,nAddBtn,nOutBtn){
        nLeft.delegate('click',function(){
            Y.all('.box-left .item-sub').removeClass('item-sub-focus');
            this.addClass('item-sub-focus');
            //importBb();
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
    function uniqueTransferBB(nLeft,nRight,nAddBtn,nOutBtn){
        nLeft.delegate('click',function(){
            Y.all('.box-left .item-sub').removeClass('item-sub-focus');
            this.addClass('item-sub-focus');
        },'.item-sub');
        nLeft.delegate('dblclick',function(){
            uniqueMove(nLeft,nRight);
        },'.item-sub');
        nRight.delegate('click',function(){
            Y.all('.box-right .item-sub').removeClass('item-sub-focus');
            this.addClass('item-sub-focus');
        },'.item-sub');
        nRight.delegate('dblclick',function(){
            uniqueMove(nRight,nLeft);
        },'.item-sub');

        function uniqueMove(src,des){
            var nItemListArray = src.all('.item-sub');
            if(nRight.one('.item-sub')){
                alert("亲，只能添加一个店内宝贝哦！")
            }else{
                for(var i=0;i < nItemListArray.size();i++){
                    if(nItemListArray.item(i).hasClass('item-sub-focus')){
                        nItemListArray.item(i).removeClass('item-sub-focus');
                        des.append(nItemListArray.item(i--));
                        break;
                    }
                }
            }
        };
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
            uniqueMove(nLeft,nRight);
        });
        nOutBtn.on('click',function(){
            move(nRight,nLeft);
        });
    };

    //专题编辑功能
    nSubList.delegate('click',function(){
        nSubList.setStyle('display','none');
        nSubSave.setStyle('display','none');
        nEditSub.setStyle('display','block');
    },'.editSub');

    nCancelSub.on('click',function(){
        nSubList.setStyle('display','block');
        nSubSave.setStyle('display','block');
        nEditSub.setStyle('display','none');
    });
    nAddSub.on('click',function(){
        addSub();
    });
    function addSub(){
        var subTitle = Y.one('#sub-title-input').get('value');
        Y.all('.sub-item-text').setContent(subTitle);
        //this.ancestor('.sub-item-text').setContent(subTitle);
        nSubList.setStyle('display','block');
        nSubSave.setStyle('display','block');
        nEditSub.setStyle('display','none');
    }


    //三个专题-链接选择显隐切换功能
    function subLinkSelect(){
        if(nSubLinkSelect.get('selectedIndex') == 1){
            Y.one('#sub-keyword').setStyle('display','block');
            Y.one('#sub-store-item').setStyle('display','none');
            Y.one('#sub-store-keyword').setStyle('display','none');
        }else if(nSubLinkSelect.get('selectedIndex') == 2){
            Y.one('#sub-keyword').setStyle('display','none');
            Y.one('#sub-store-item').setStyle('display','block');
            Y.one('#sub-store-keyword').setStyle('display','none');
        }else if(nSubLinkSelect.get('selectedIndex') == 3){
            Y.one('#sub-keyword').setStyle('display','none');
            Y.one('#sub-store-item').setStyle('display','none');
            Y.one('#sub-store-keyword').setStyle('display','block');
        }else if(nSubLinkSelect.get('selectedIndex') == 0){
            Y.one('#sub-keyword').setStyle('display','none');
            Y.one('#sub-store-item').setStyle('display','none');
            Y.one('#sub-store-keyword').setStyle('display','none');
        }
    }
    nSubLinkSelect.on('click',function(){
        subLinkSelect();
    })

    //六个宝贝-点击批量导入宝贝按钮
    nImportBb.on('click',function(){
        nImportBb.setStyle('display','none');
        nBbList.setStyle('display','none');
        nBbAdd.setStyle('display','inline-block');
        nBbCancel.setStyle('display','inline-block');
        Y.one('#bb-store-product').setStyle('display','block');
        Y.one('#bb-save').setStyle('display','none');
        transferBB(Y.one('#bb-store-product .box-left'),Y.one('#bb-store-product .box-right'),
            Y.one('#bb-store-product .add-transfer-button'),Y.one('#bb-store-product .add-transfer-button2'));
        importBB();
    })
    //六个宝贝-取消按钮事件
    nBbCancel.on('click',function(){
        Y.one('#bb-store-product').setStyle('display','none');
        nImportBb.setStyle('display','block');
        nBbList.setStyle('display','block');
        nBbAdd.setStyle('display','none');
        nBbCancel.setStyle('display','none');
        Y.one('#bb-save').setStyle('display','block');
    })
    //六个宝贝-修改宝贝与添加宝贝绑定事件
    nBbList.delegate('click',function(){
        Y.one('#bb-store-product').setStyle('display','block');
        nBbAdd.setStyle('display','inline-block');
        nBbCancel.setStyle('display','inline-block');
        nBbList.setStyle('display','none');
        Y.one('#bb-save').setStyle('display','none');
        uniqueTransferBB(Y.one('#bb-store-product .box-left'),Y.one('#bb-store-product .box-right'),
            Y.one('#bb-store-product .add-transfer-button'),Y.one('#bb-store-product .add-transfer-button2'));
        importBB();
    },'.modifyBb')
    //六个宝贝--宝贝批量添加
    Y.one('#bb-add-button').on('click',function(){
        if(!Y.one('#bb-store-product .box-right').one('.item-sub')){
            alert("亲，你还没有选择宝贝哦！")
        }else{
            var bbList = "";
            var selectList = Y.all('#bb-store-product .box-right .item-sub');
            if(selectList.size() > 6){
                alert("亲，只能添加六个宝贝哦！")
            }else{
                for( var i= 0;i< selectList.size();i++){
                    var j=i+1;
                    var picUrl = selectList.item(i).one('.item-sub-pic img').getAttribute('src');
                    var title = selectList.item(i).one('.item-sub-dscptn .title').getAttribute('title');
                    var price = selectList.item(i).one('.item-sub-dscptn .price').getContent();
                    bbList += '<div class="bb-num bb-num'+j+'">'+j+'</div>'+
                              '<li class="bb-item">'+
                                  '<div class="bb-item-pic"><img src="'+picUrl+'" /></div>'+
                                  '<div class="bb-item-dscptn">'+
                                      '<div class="title" title="'+title+'">'+title+'</div>'+
                                      '<div class="price">'+price+'</div>'+
                                  '</div>'+
                                  '<div class="bb-item-button">'+
                                      '<button class="modifyBb"><img src="./img/edit/modify-bb.PNG" /></button>'+
                                  '</div>'+
                                  '<div class="bb-item-shift">'+
                                      '<div class="item-shift-box">'+
                                          '<div class="item-shift-up2"></div>'+
                                      '</div>'+
                                      '<div class="item-shift-box">'+
                                          '<div class="item-shift-down2"></div>'+
                                      '</div>'+
                                  '</div>'+
                              '</li>'
                }
                nBbList.setContent(bbList);
                Y.one('#bb-store-product').setStyle('display','none');
                nImportBb.setStyle('display','block');
                nBbList.setStyle('display','block');
                nBbAdd.setStyle('display','none');
                nBbCancel.setStyle('display','none');
                Y.one('#bb-save').setStyle('display','block');
            }

        }
    })

    //热销模块选择宝贝--弹出宝贝框
    Y.one('.select-bb').on('click',function(){
        Y.one('#mask-overlay').setStyle('display','block');
        nHotStoreBb.setStyle('display','block');
        transferBB(Y.one('#hot-store-product .box-left'),Y.one('#hot-store-product .box-right'),
            Y.one('#hot-store-product .add-transfer-button'),Y.one('#hot-store-product .add-transfer-button2'));
        importBB();
    })

    //热销宝贝模块--选择宝贝弹出框添加与取消按钮事件
    Y.one('.hot-cancel-button').on('click',function(){
        Y.one('#mask-overlay').setStyle('display','none');
        nHotStoreBb.setStyle('display','none');
    })
    Y.one('.hot-add-button').on('click',function(){
        if(!Y.one('#hot-store-product .box-right').one('.item-sub')){
            alert('亲，你还没有选择要屏蔽的宝贝哦！')
        }else{
            Y.one('#mask-overlay').setStyle('display','none');
            nHotStoreBb.setStyle('display','none');
            var disableList = "";
            var selectList = Y.all('#hot-store-product .box-right .item-sub');
            for( var i= 0;i< selectList.size();i++){
                var title = selectList.item(i).one('.item-sub-dscptn .title').getAttribute('title');
                disableList += '<li class="text">'+
                                   '<div class="link">'+title+'</div>'+
                                   '<div class="link cancel-dis">取消屏蔽</div>'+
                               '</li>'
            }
            Y.one('.hot-sell .disable-box').setContent(disableList);
        }
    })

    var dd = new Y.DD.Drag({
        node:'#hot-store-product'
    }).addHandle('#hot-store-product');

    //取消屏蔽宝贝功能
    Y.one('.hot-sell .disable-box').delegate('click',function(){
        this.ancestor('.text').remove();
    },'.cancel-dis')


});

