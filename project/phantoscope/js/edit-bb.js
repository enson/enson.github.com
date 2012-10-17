/**
 * User: xijian.py
 * Date: 12-10-15
 * Time: 上午10:40
 * Description:内容编辑页面宝贝大全的逻辑交互
 */
YUI().use('node','node-event-delegate',function(Y){
    var nAddClass = Y.one('#add_class_button');
    var nClassList = Y.one('#class-list');
    var nClassSave = Y.one('#class-save');
    var nSubClass= Y.one('.subClass');

    var nCancelSubClass = Y.one('#cancel-subClass-button');
    var nAddSubClass = Y.one('#add-subClass-button');

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

    //点击添加分类按钮事件
    nAddClass.on('click',function(){
        nAddClass.setStyle('display','none');
        nClassList.setStyle('display','none');
        nClassSave.setStyle('display','none');
        nSubClass.setStyle('display','block');
    })

    //下方添加和取消按钮事件
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

    //添加自定义关键词事件
    nAddKeyword.on('click',function(){
        nSubClass.setStyle('display','none');
        nKeywordInput.setStyle('display','block');
    })

    //自定义关键词输入的添加和取消事件
    nKeywordCancelBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nKeywordInput.setStyle('display','none');
    })
    nKeywordAddBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nKeywordInput.setStyle('display','none');
    })

    //批量导入类目
    nImportClass.on('click',function(){
        nSubClass.setStyle('display','none');
        nClassStore.setStyle('display','block');
    })

    //导入店铺类目 --添加与取消事件
    nStoreCancelBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nClassStore.setStyle('display','none');
    })
    nStoreAddBtn.on('click',function(){
        nSubClass.setStyle('display','block');
        nClassStore.setStyle('display','none');
    })

    //店铺类目框中类目的左右移动
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


});

