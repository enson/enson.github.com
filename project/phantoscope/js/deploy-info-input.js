/**
 * User: xijian.py
 * Date: 12-10-17
 * Time: 上午10:45
 * Description:发布客户端--信息填写页面交互逻辑
 */
YUI().use('node','event','node-event-delegate',function(Y){
    var getList1 = function(){
        return Y.all('.a-upload-pic .file-box');
    }
    var nAInputList = getList1();

    var getList2 = function(){
        return Y.all('.i-upload-pic .file-box');
    }
    var nIInputList = getList2();

    //点击添加上传截图控件
    Y.one('.add-pic-btn1').on('click',function(){
        nAInputList = getList1();
        if(nAInputList.size() > 11){
            alert("亲，Android产品截图最多添加12张哦！");
        }else{
            Y.one('.a-upload-pic').append(
                '<div class="file-box">'+
                    '<input type="text" name="textfield" id="textfield" class="txt txt2" />'+
                    '<input type="button" class="btn btn2" value="" />'+
                    '<input type="file" name="fileField" class="file" size="28" />'+
                    '<input type="submit" name="submit" class="submit-btn" value="" />'+
                '</div>'
            )
        }
    })
    Y.one('.add-pic-btn2').on('click',function(){
        nIInputList = getList2();
        if(nIInputList.size() > 4){
            alert("亲，iPhone产品截图最多添加5张哦！");
        }else{
            Y.one('.i-upload-pic').append(
                '<div class="file-box">'+
                    '<input type="text" name="textfield" id="textfield" class="txt txt2" />'+
                    '<input type="button" class="btn btn2" value="" />'+
                    '<input type="file" name="fileField" class="file" size="28" />'+
                    '<input type="submit" name="submit" class="submit-btn" value="" />'+
                '</div>'
            )
        }
    })

    //输入框显示上传控件里选中的文件路径
    Y.one('.a-upload-pic').delegate('change',function(){
        this.previous('.txt').setAttribute('value',this.get("value"));
    },'.file')
    Y.one('.i-upload-pic').delegate('change',function(){
        //alert(this.get('value'));
        this.previous('.txt').setAttribute('value',this.get("value"));
    },'.file')

    //判断有无上传文件
    Y.one('.a-upload-pic').delegate('click',function(){
        var nValue = this.previous('.txt').get('value');
        if(!nValue){
            alert('亲，你还没有上传截图哦！');
        };
    },'.submit-btn')
    Y.one('.i-upload-pic').delegate('click',function(){
        var nValue = this.previous('.txt').get('value');
        if(!nValue){
            alert('亲，你还没有上传截图哦！');
        };
    },'.submit-btn')
});
