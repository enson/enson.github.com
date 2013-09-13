/*
    RULES:

    [
        {
            name: 'birthday',
            value: '1988-10-12',
            rules: ['required', 'birthday', function(type, msg) {
                
            }]
        },
        {
            name: 'card_number',
            value: '4111221873243423',
            rules: ['required']
        },
        {
            name: 'passengername',
            value: 'tbtest1101',
            rules: ['required']
        }
    ]
*/

var Validator = function () {
    var that = this;
    that.initialize.apply(this, arguments);
};

Validator.prototype = {
    initialize: function () {
        var that = this;

        that.ruleFnMap = {
            'required': that._required,
            'birthday': that._birthday,
            'id': that._id,
            'name': that._name
        };
    },

    doValidation: function(rules) {
        var that = this;
        var result = {
            status: true
        };
        
        if(that.isArray(rules)) {
            var status = true;
            var _it, rule_name, rule_cb, rule_status = true, rule_list;
            var rule_fn, rule_ret, rule_pause;

            for(var i = 0; i < rules.length; i++) {
                _it = rules[i];
                rule_name = _it.name;
                rule_value = _it.value;
                rule_list = _it.rules;

                if(that.isFunction(rule_list[rule_list.length - 1])) {
                    rule_cb = rule_list.pop();
                }

                for(var j = 0; j < rule_list.length; j++) {
                    rule_fn = that.ruleFnMap[rule_list[j]];
                    rule_ret = rule_fn.call(this, rule_value);

                    if(!rule_ret[0]) {
                        rule_status = false;
                        rule_pause = rule_list[j];
                        break;
                    }
                }

                if(!rule_status) {
                    status = false;
                    rule_cb && rule_cb.call(this, rule_pause, rule_ret[1]);
                    break;
                }
            }

            result.status = status;
            return result;
        }
    },

    toString: Object.prototype.toString,

    isArray: Array.isArray || function(val) {
        var that = this;
        return that.toString.call(val) === '[object Array]';
    },

    isFunction: function(val) {
        var that = this;
        return that.toString.call(val) === '[object Function]';
    },

    _required: function(value) {
        if(!value.length) {
            return [false];
        }

        return [true];
    },

    _birthday: function(value) {
        return [true, 'ceshi2'];
    },

    _id: function(value) {
        var idcard = value;
        var reg,S,M,Y,JYM;
        var idcard_length = idcard.length;
        var idcard_array = new Array();

        idcard_array = idcard.split("");

        var numReg =/^[Xx0-9]+$/, r;

        if(!numReg.test(idcard)) {
            for(var i = 0 ;i<idcard_length ; i++) {
                var d = idcard.substr(i,1);
                if(!numReg.test(d)) {
                    r = d;
                    break;
                }

            }
            return [false, '身份证号码含有无法识别的字符"'+r+'"'];
        }

        var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"xinjiang",71:"台湾",81:"香港",82:"澳门",91:"国外"};

        if(idcard.length == 0 || idcard == '请填写证件号码'){
            return [false, '请填写证件号码'];
        }

        if(area[parseInt(idcard.substr(0,2))] == null){
            return [false, '身份证地区不存在'];
        }

        
        switch(idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
                    reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
                } else {
                    reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
                }

                if(reg.test(idcard)) {
                    return [true];
                } else {
                    return [false, '身份证号码出生日期有误，请按照证件中的出生日期填写'];
                }

                break;

            case 18:
                if( parseInt(idcard.substr(6,4)) % 4 == 0 || ( parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
                    reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                } else {
                    reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                }

                if(reg.test(idcard)) {
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3 ;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y,1);

                    if(M == idcard_array[17].toUpperCase()) {
                        return [true];
                    } else {
                        return [false, '身份证号码错误，请核对并修改'];
                    }

                } else {
                    return [false, '身份证号码出生日期有误，请按照证件中的出生日期填写'];
                }

                break;

            default:
                return [false, '身份证号码位数不符'];
                break;
        };
    },

    _name: function(value) {
        if(value.match(/^[a-zA-Z]*$/igm)) {
            return [false, '姓名为拼音请在姓和名之间用半角 / 分隔'];
        }

        if(value.match(/^[a-zA-Z]*\/[a-zA-Z]*$/igm)) {
            var _value = value.split('/');
            
            if(_value.length !== 2) {
                return [false, '姓名为拼音请在姓和名之间用半角 / 分隔'];
            }
            
            if(_value[0].length < 2 || _value[1].length < 2) {
                return [false, '姓和名的拼音不能少于两位字母'];
            }
        }

        return [true];
    }
};
