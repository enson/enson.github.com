/**
 * @description util
 * @author yingyi.zj@taobao.com
 * */
KISSY.add(function (S) {

    var supportLocalStorage = (function () {
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    })();

    var supportSessionStorage = (function () {
        var test = 'test';
        try {
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    })();

    var timeTag = 0;

    return {
        /**
         * locStorage util
         */
        locStorage   : {
            set : function (key, value) {
                if (supportLocalStorage) {
                    localStorage.setItem(key, value);
                }else if(supportSessionStorage){
                    sessionStorage.setItem(key, value);
                }
            },
            get : function (key) {
                if (supportLocalStorage) {
                    return localStorage.getItem(key);
                }else if(supportSessionStorage){
                    return sessionStorage.getItem(key);
                }
            },
            removeItem : function (key) {
                if (supportLocalStorage) {
                    return localStorage.removeItem(key);
                }else if(supportSessionStorage){
                    return sessionStorage.removeItem(key);
                }
            },
            isSupport : function (key) {
                return supportLocalStorage || supportSessionStorage;
            }
        },
        /**
         * parse json 报错处理
         */
        json         : {
            parse : function (data) {
                var result = null;

                try {
                    result = JSON.parse(data);
                } catch (e) {

                } finally {
                    return result;
                }
            }
        },
        /**
         * 某些手机使用iscroll后，会出现2次触发点击，使用400ms判断是否触发2次点击
         * @param divisionTime
         * @returns {boolean}
         */
        isOverClick  : function (divisionTime) {
            var now = new Date().getTime();

            divisionTime = divisionTime || 400;

            if (now - timeTag > divisionTime) {
                timeTag = now;
                return false;
            } else {

                timeTag = 0;
                return true;
            }
        },
        /**
         * 从location.search || location.hash 中获取查询参数对象，默认从location.search中获取
         * @param search
         * @returns {{}}
         */
        getSearchObj : function (search) {
            var _search = search || location.search;
            var queryIndex = (_search).indexOf("?");
            var obj = {};

            if (queryIndex > -1) {
                var searches = _search.substring(queryIndex + 1, _search.length).split("&");

                $.each(searches, function (k, v) {
                    var pair = v.split("=");

                    obj[pair[0].toString()] = pair[1];
                });
            }

            return obj;
        },
        /**
         * reflow
         */
        reflow       : function () {
            document.body.style.zoom = '1.0001';
            setTimeout(function () {
                document.body.style.zoom = '1';
            }, 100);
        }
    }

});
