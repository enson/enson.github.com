/**
 * @fileoverview address.
 * @author 棪木<yanmu.wj@taobao.com>
 */
KISSY.add(function(S, Node, DOM, Event, UA) {
    // 源数据
    var _data = null,
        data = {},
    // first level data
        dataP = null,
        prevValue;

    var Address = function (cfg) {
        if (!(this instanceof Address)) {
            return new Address(cfg);
        }

        cfg = cfg || {};

        this._elSelects = cfg.elSelects;
        this._focus = cfg.focus;
        this._oversea = S.isUndefined(cfg.oversea) ? true : !!cfg.oversea;
        this._overseaPy = !!cfg.overseaPy;
        this._daily = !!cfg.daily;

        this._filter = S.isFunction(cfg.filter) ? cfg.filter : null;

        this._available = true;

        this._init();
    };

    S.augment(Address, Event.Target, {
        _init: function() {
            if (!S.isObject(this._elSelects) || S.isEmptyObject(this._elSelects)) {
                this._available = false;
                return;
            }

            var self = this;

            this._initSelects();

            this._getData(function() {
                self._render(true);
            });

        },
        focus: function(opt) {
            if (!this._available || !S.isObject(opt)) return;
            this._focus = opt;

            this._render();
        },
        /*
         * @param includeText[Boolean]: 是否返回text，默认false
         */
        val: function(includeText) {
            var p = this._elSelects.province,
                c = this._elSelects.country,
                pr = this._elSelects.provinceExt,
                ci = this._elSelects.city,
                a = this._elSelects.area;

            if (!!includeText) {
                return {
                    province: {value: p && p.val(), text: p && p[0].options.length ? p[0].options[p[0].selectedIndex].text : null}
                    , country: {value: c && c.val(), text: c && c[0].options.length ? c[0].options[c[0].selectedIndex].text : null}
                    , provinceExt: {value: pr && pr.val(), text: pr && pr[0].options.length ? pr[0].options[pr[0].selectedIndex].text : null}
                    , city: {value: ci && ci.val(), text: ci && ci[0].options.length ? ci[0].options[ci[0].selectedIndex].text : null}
                    , area: {value: a && a.val(), text: a && a[0].options.length ? a[0].options[a[0].selectedIndex].text : null}
                };
            }
            
            return {
                province: p && p.val()
                , country: c && c.val()
                , provinceExt: pr && pr.val()
                , city: ci && ci.val()
                , area: a && a.val()
            };
        },
        _render: function(placeholder) {
            this.FOCUSPATH = this._getPath(this._getNode(this._focus));
            // 初始化时无未定义focus
            placeholder = placeholder && !this.FOCUSPATH.province;
            this._renderSelect({
                key: "province",
                data: placeholder ? [{id: "", value: ["请选择省市/其他..."]}].concat(dataP) : dataP,
                placeholder: !!placeholder
            });
            this._fireChange();
        },
        _getNode: function(opt) {
            // 查询树 非递归
            opt = opt || {};

            if (!_data || (!opt.text && !opt.pingyin && !opt.id)) return;

            if (opt.id === "990100") {
                opt.id = "990000";
            }

            for (var id in _data) {
                if (opt.id === id || (!S.isUndefined(_data[id][2]) && opt.pingyin === _data[id][2]) || (!S.isUndefined(_data[id][0]) && opt.text === _data[id][0])) {
                    return {
                        id: id,
                        value: _data[id]
                    };
                }
            }
        },
        _getNodes: function(filter, isOrigin) {
            filter = S.isFunction(filter) ? filter : function(){return true;};

            var ret = [],
                d = isOrigin ? _data : data;

            S.each(d, function(node, id) {
                var nd = {id: id, value: node};
                if (filter(nd)) {
                    ret.push(nd);
                }
            });

            return ret;
        },
        _initSelects: function() {
            var i = 0,
                self = this;

            S.each(this._elSelects, function(select, key) {
                select = S.one(select);
                select && select.attr("data-key", key);

                self._elSelects[key] = select;

                select.on("change", function(e) {
                    var el = S.one(e.currentTarget),
                        children = self._getNodes(function(node){
                            return node.value[1] === el.val();
                        });

                    if (el[0].options[0] && el[0].options[0].value === "") {
                        el[0].remove(0);
                    }

                    self._isOverSea();

                    if (!children || !children.length) {
                        self._hideSelects(el.attr("data-key"), el.val() === "990000");
                        self._fireChange();
                        return;
                    }

                    self._renderSelect({
                        key: self._getChildKey(el.attr("data-key"), el.val() === "990000"),
                        data: children
                    });

                    self._fireChange();
                });
            });

        },
        // 获取路径
        // return {
        //      province:
        //      country:
        //      provinceExt:
        //      citry:
        //      area:
        // }
        _getPath: function(node) {
            var self = this;
            var path = [],
                ret = {};

            _get(node);

            function _get(nd) {
                if (nd) {
                    path.unshift(nd);
                    var pt = self._getNode({id: nd.value[1]});
                    if (pt && pt.value[1] !== "0") {
                        _get(pt);
                    }
                }
            }

            if (!path.length) return ret;

            ret.province = path[0];

            if (ret.province.id === "990000") {
                ret.country = path[1];
                ret.provinceExt = path[2];
                ret.city = path[3];
                ret.area = path[4];
            }
            else {
                ret.city = path[1];
                ret.area = path[2];
            }

            return ret;
        },
        _renderSelect: function(opt) {
            var el = this._elSelects[opt.key],
                fnode = this.FOCUSPATH[opt.key],
                placeholder = opt.placeholder,
                data = opt.data,
                children,
                self = this;

            if (!el || !data || !data.length) {
                this._hideSelects(opt.key);
                return;
            }

            /*
             * 当parentId不一致时，当前节点肯定不是focus节点
             */
            if (fnode && data[0].value[1] !== fnode.value[1]) {
                fnode = null;
            }

            // empty select
            this._hideSelect(opt.key);
            // render select
            S.each(data, function(node, index) {
                // render
                var selected;
                if (fnode) {
                    selected = fnode && fnode.id === node.id ? true : false;
                }
                else if (index === 0){
                    selected = true;
                }

                // firefox, chrome对innerHTML有兼容问题
                var item = new Option((opt.key !== "province" && self.isOverSea && self._overseaPy && node.value[2] ? node.value[2] + "/" : "") + node.value[0], node.id);
                item.selected = selected;

                el[0].options.add(item);

                if (selected) {
                    self._isOverSea();

                    if (placeholder) {
                        children = [{id:"", value:[opt.key === "province" ? "请选择城市..." : "请选择区/县..."]}];
                    }
                    else if (el.val() === "990000" && !self.FOCUSPATH["country"]) {
                        children = [{id:"", value:["请选择国家/地区..."]}].concat(self._getNodes(function(node, key){
                            return node.value[1] === "990000";
                        }));
                    }
                    else {
                        children = self._getNodes(function(nd) {
                            return nd.value[1] === node.id;
                        });
                    }
                }
            });

            if (this._elSelects.province && this._elSelects.province.val() !== "990000") {
                this._hideSelect("country");
                this._hideSelect("provinceExt");
            }


            el.css({"display": "", "visibility": ""});

            // render children
            if (children && children.length) {
                this._renderSelect({
                    key: this._getChildKey(opt.key, el.val() === "990000"),
                    data: children,
                    placeholder: placeholder
                });
            }
            // hide other select?
            else {
                this._hideSelects(opt.key);
            }
        },
        _hideSelects: function(key) {

            var childKey = this._getChildKey(key),
                child;

            if (child = this._elSelects[childKey]) {
                this._hideSelect(childKey);
                this._hideSelects(childKey);
            }
        },
        _hideSelect: function(key) {
            var select = this._elSelects[key];

            if (select) {
                select.hide();
                if (S.UA.ie === 6) {
                    while(select[0].options.length) {
                        select[0].remove(select[0].options.length - 1);
                    }
                }
                else {
                    select.html("");
                }
            }
        },
        _isOverSea: function() {
            var select = this._elSelects["province"];

            if (select.val() === "990000") {
                this.isOverSea = true;
            }
            else {
                this.isOverSea = false;
            }
        },
        _getChildKey: function(key, ext) {
            var childKey;

            switch (key) {
                case "province":
                    childKey = ext ? "country" : "city";
                    break;
                case "provinceExt":
                    childKey = "city";
                    break;
                case "country":
                    childKey = "provinceExt";
                    break;
                case "city":
                    childKey = "area";
                    break;
                default:
                    break;
            }

            return childKey;
        },
        _fireChange: function() {
            var v = S.param(this.val());
            if (prevValue && prevValue !== v) {
                this.fire("change");
            }
            prevValue = v;
        },
        _filterData: function(key, val) {
            if (key && val && !data[key]) {
                data[key] = val;

                // 父节点已经存在
                if (data[val[1]]) return;

                var pt = this._getNode({id: val[1]});

                if (pt) {
                    this._filterData(pt.id, pt.value);
                }
            }
        },
        _getData: function(callback) {
            //var url = "http://wuliu." + (this._daily ? "daily.taobao.net" : "taobao.com") + "/user/output_address.do?range=all&tree=true",
            var url = "http://" + (this._daily ? "assets.daily.taobao.net" : "a.tbcdn.cn") + "/p/address/130806/tdist_py.js",
                self = this;

            S.getScript(url, {
                charset: "gbk",
                success: function() {
                    if (S.isPlainObject(window.tdist_all) && !S.isEmptyObject(window.tdist_all)) {
                        _data = window.tdist_all;

                        // 海外地址修正parent为990000
                        S.each(_data, function(node, key) {
                            node[1] = node[1] === "0" && key !== "1" ? "990000" : node[1];

                            if (key === "990100") {
                                delete _data[key];
                                return;
                            }

                            // filter
                            if (self._filter) {
                                if (self._filter({id: key, value: node})) {
                                    self._filterData(key, node);
                                }
                            }
                            else {
                                data = _data;
                            }

                        });

                        dataP = self._getNodes(function(node) {
                            return node.value[1] === "1" && (self._oversea ? 1 : node.id !== "990000");
                        });
                    }

                    callback();
                }
            });
        }
    });

    return Address;
}, {
    requires: ["node", "dom", "event", "ua"]
});
