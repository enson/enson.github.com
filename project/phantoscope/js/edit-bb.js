/**
 * User: xijian.py
 * Date: 12-10-15
 * Time: 上午10:40
 * Description:内容编辑页面宝贝大全的逻辑交互
 */
YUI().use('node','node-event-delegate','jsonp',function(Y){
    var nAddClass = Y.one('#add_class_button');
    var nClassList = Y.one('#class-list');
    var nClassSave = Y.one('#class-save');
    var nSubClass= Y.one('.subClass');
    var nFirstClass = Y.one('.firstClass');

    var nCancelSubClass = Y.one('#cancel-subClass-button');
    var nAddSubClass = Y.one('#add-subClass-button');

    var nAddFirstClass = Y.one('#add-firstClass-button');
    var nCancelFirstClass = Y.one('#cancel-firstClass-button');

    var nSubClassList = Y.one('.subClass-list');

    var nAddKeyword = Y.one('.add-keyword');
    var nImportClass = Y.one('.import-class');

    var nKeywordInput = Y.one('.keyword-input');
    var nKeywordAddBtn = Y.one('.keyword-add-button');
    var nKeywordCancelBtn = Y.one('.keyword-cancel--button');

    var nClassStore = Y.one('.class-store');
    var nStoreAddBtn = Y.one('.store-add-button');
    var nStoreCancelBtn = Y.one('.store-cancel-button');


    //删除分类
    nClassList.delegate('click',function(){
        this.ancestor('.class-item').remove();
    },'.deleteClass');
    //编辑进入二级分类编辑页面
    nClassList.delegate('click',function(){
        nAddClass.setStyle('display','none');
        nClassList.setStyle('display','none');
        nClassSave.setStyle('display','none');
        nSubClass.setStyle('display','block');
        shiftLi(nSubClassList);
    },'.editClass');

    //点击添加一级分类按钮事件
    nAddClass.on('click',function(){
        nAddClass.setStyle('display','none');
        nClassList.setStyle('display','none');
        nClassSave.setStyle('display','none');
        nFirstClass.setStyle('display','block');
    })

    //添加一级分类界面--添加和取消按钮事件
    nCancelFirstClass.on('click',function(){
        nAddClass.setStyle('display','block');
        nClassList.setStyle('display','block');
        nClassSave.setStyle('display','block');
        nFirstClass.setStyle('display','none');
    })
    nAddFirstClass.on('click',function(){
        nAddClass.setStyle('display','block');
        nClassList.setStyle('display','block');
        nClassSave.setStyle('display','block');
        nFirstClass.setStyle('display','none');
        var title = Y.one('.firstClass .title input').get('value');
        nClassList.append(
            '<li class="class-item">'+
                '<div class="class-text">'+
                    '<div class="class-name">'+title+'</div>'+
                    '<ul>'+
                    '</ul>'+
                ' </div>'+
                '<div class="button">'+
                    '<button class="editClass"><img src="./img/edit/edit.PNG" /></button>'+
                    '<button class="deleteClass"><img src="./img/edit/delete.PNG" /></button>'+
                '</div>'+
                '<div class="class-item-shift">'+
                    '<div class="item-shift-box">'+
                        '<div class="item-shift-up2"></div>'+
                    '</div>'+
                    '<div class="item-shift-box">'+
                        '<div class="item-shift-down2"></div>'+
                    '</div>'+
                '</div>'+
            '</li>'
        )
    })


    //二级分类-下方添加和取消按钮事件
    nCancelSubClass.on('click',function(){
        nAddClass.setStyle('display','block');
        nClassList.setStyle('display','block');
        nClassSave.setStyle('display','block');
        nSubClass.setStyle('display','none');
    });
    nAddSubClass.on('click',function(){
        nAddClass.setStyle('display','block');
        nClassList.setStyle('display','block');
        nClassSave.setStyle('display','block');
        nSubClass.setStyle('display','none');
    })

    //删除二级分类
    nSubClassList.delegate('click',function(){
        this.ancestor('.subClass-item').remove();
    },'.deleteSubClass')

    //二级分类-添加自定义关键词事件
    nAddKeyword.on('click',function(){
        nSubClass.setStyle('display','none');
        nKeywordInput.setStyle('display','block');
    })

    //二级分类-自定义关键词输入的添加和取消事件
    nKeywordCancelBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nKeywordInput.setStyle('display','none');
    })
    nKeywordAddBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nKeywordInput.setStyle('display','none');
        var keyWord = Y.one('.keyword-input input').get('value');
        nSubClassList.append(
            '<li class="subClass-item">'+
                '<div class="subClass-item-text">'+keyWord+'</div>'+
                '<div class="subClass-item-button">'+
                    '<img src="./img/edit/check-link.PNG" />'+
                    '<button class="editSubClass"><img src="./img/edit/edit.PNG" /></button>'+
                    '<button class="deleteSubClass"><img src="./img/edit/delete.PNG" /></button>'+
                '</div>'+
                '<div class="subClass-item-shift">'+
                    '<div class="item-shift-box">'+
                        '<div class="item-shift-up2"></div>'+
                    '</div>'+
                    '<div class="item-shift-box">'+
                        '<div class="item-shift-down2"></div>'+
                    '</div>'+
                '</div>'+
            '</li>'
        )
    })

    //二级分类-批量导入类目
    nImportClass.on('click',function(){
        nSubClass.setStyle('display','none');
        nClassStore.setStyle('display','block');
        transferBB(Y.one('.class-store .box-left'),Y.one('.class-store .box-right'),
            Y.one('.class-store .add-transfer-button'),Y.one('.class-store .add-transfer-button2'));
        importCate();
    })

    //店铺类目数据引入
    function importCate(){
        var catUrl = './catData.jsonp?'+
            '&callback=importCat';
        window.importCat = function(data){
            var items = data.cats,len = items.length;
            var itemsList = '';
            for(var i=0;i < len;i++){
                itemsList += '<li class="item-sub" title="'+items[i].id+'">'+items[i].name+'</li>';
                //<li class="item-sub">
                var subCat = items[i].subCats;
                for(var j=0;j< subCat.length;j++){
                    itemsList += '<li class="item-sub" title="'+subCat[j].id+'">'+subCat[j].name+'</li>';
                }
            }
            Y.one('.class-store .box-left').setContent(itemsList);
        }
        Y.jsonp(catUrl,importCat);
    };

    //二级分类--导入店铺类目 --添加与取消事件
    nStoreAddBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nClassStore.setStyle('display','none');
        var list = Y.all('.class-store .box-right .item-sub');
        var itemsList = '';
        for(var i=0;i<list.size();i++){
            itemsList+= '<li class="subClass-item">'+
                            '<div class="subClass-item-text">'+list.item(i).getContent()+'</div>'+
                            '<div class="subClass-item-button">'+
                                '<img src="./img/edit/check-link.PNG" />'+
                                '<button class="editSubClass"><img src="./img/edit/edit.PNG" /></button>'+
                                '<button class="deleteSubClass"><img src="./img/edit/delete.PNG" /></button>'+
                            '</div>'+
                            '<div class="subClass-item-shift">'+
                                '<div class="item-shift-box">'+
                                    '<div class="item-shift-up2"></div>'+
                                '</div>'+
                                '<div class="item-shift-box">'+
                                    '<div class="item-shift-down2"></div>'+
                                '</div>'+
                            '</div>'+
                        '</li>'
        };
        nSubClassList.append(itemsList);

    })
    nStoreCancelBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nClassStore.setStyle('display','none');
    })

    //店铺类目框中类目的左右移动
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
        moveRight(Y.one('.leftSel'), Y.one('.rightSel'));
    });
    Y.one('.out-transfer-button').on('click',function(){
        moveRight(Y.one('.rightSel'),Y.one('.leftSel'));
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

    //分类list上下移动功能函数
    function shiftLi(nList){
        nList.delegate('click',function(){
            var getList=function(){
                return nList.all('li');
            };
            var nListArray = getList();
            for(var i=0; i<nListArray.size(); i++){
                if(this.ancestor('li') == nListArray.item(i)){
                    var prevItem = nListArray.item(i-1);
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
                    nListArray.item(i).insert(nextItem,'before');
                    break;
                }
            }
        },'.item-shift-down2');
    };

    //页面初始化加载一级分类list上下移动功能
    window.onload = function(){
        shiftLi(nClassList);
    };



});

