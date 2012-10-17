/**
 * User: xijian.py
 * Date: 12-10-17
 * Time: 上午10:45
 * Description:发布客户端--信息填写页面交互逻辑
 */
YUI().use('node','event',function(Y){
    var getList1 = function(){
        return Y.all('.a-upload-pic .title2');
    }
    var nAInputList = getList1();

    var getList2 = function(){
        return Y.all('.i-upload-pic .title2');
    }
    var nIInputList = getList2();

    Y.one('.add-pic-btn1').on('click',function(){
        nAInputList = getList1();
        if(nAInputList.size() > 4){
            alert("亲，最多添加5张哦！");
        }else{
            Y.one('.a-upload-pic').append(
                '<div class="title2"><input type="file" /><img src="./img/deploy/upload-btn.PNG" /></div>'
            )
        }
    })
    Y.one('.add-pic-btn2').on('click',function(){
        nIInputList = getList2();
        if(nIInputList.size() > 4){
            alert("亲，最多添加5张哦！");
        }else{
            Y.one('.i-upload-pic').append(
                '<div class="title2"><input type="file" /><img src="./img/deploy/upload-btn.PNG" /></div>'
            )
        }
    })
});
