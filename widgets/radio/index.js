/**
 * @fileoverview 
 * @author 虎牙<huya.nzb@alibaba-inc.com>
 * @module radio
 **/
KISSY.add(function(S, Base) {
    
    function RadioExt() {
        this.initRadio.apply(this, arguments);
    }
    
    RadioExt.ATTRS = {
        
        value: {
            value: ''
        },
        
        text: {
            value: ''  
        },
        
        index: {
            value: -1  
        },
        
        list: {
            setter: function(v) {
                return v && $(v);
            }
        },
        
        items: {
            value: ''
        },
        
        event: {
            value: 'click'  
        },
        
        checkedItem: {
            value: null
        },
        
        checked: {
            value: 0
        },
        
        listTemplate: {
            value: '<ul></ul>'
        },
        
        itemTemplate: {
            value: '<li data-value="{value}" data-text="{text}"><span>{text}</span><b></b></li>'
        }
    };
    
    S.augment(RadioExt, {
        
        initRadio: function() {
            var mobile = $.os.phone || $.os.tablet;
            this.radioRendered = false;
            this.event = this.get('event');
            this.event = !mobile ? 'click' : this.event;
        },
        
        destroyRadio: function() {
            if (this.items) {
                this.items.off();
                this.items.remove();
            }
        },
        
        renderRadio: function() {
            this._createList();
            this._createItems();
            return this;
        },
        
        bindRadio: function() {
            //delegate
            this.items.on(this.event, $.proxy(this._onRadioItemClick, this));
            
            if (this.radioRendered) { return this; }
            
            this.on('afterItemsChange', this._afterRadioItemsChange);
            this.on('afterCheckedItemChange', this._afterCheckedItemChange);
            
            return this;
        },
        
        syncRadio: function(item) {
            var checked = this.get('checked');
            
            if (typeof item != 'undefined') {
                this.select(item);
            } else if (typeof checked != 'undefined') {
                this.select(checked);
            }
            
            this.radioRendered = true;
            
            return this;
        },

        refresh: function(item) {
            this.renderRadio();
            this.bindRadio();
            this.syncRadio(item);
            return this;
        },
        
        select: function(item, silent) {
            var node;
            
            if (typeof item === 'number') {
                item = item > -1 ? this.items.eq(item) : null;
                item = item && item[0] || null;
            } else if (typeof item === 'string') {
                item = this.getItemByVal(item);
            } else if (item && typeof item.find === 'function') {
                item = item[0];
            }
            
            if (item) {
                node = $(item);
                this.fire('beforeSelect', {
                    node: node,
                    item: item,
                    value: node.attr('data-value'),
                    text: node.attr('data-text'),
                    index: this.items.indexOf(item) 
                });
                this.set('checkedItem', item, {
                    data: {
                        selectSilent: silent
                    }
                });
            }
            
            return this;
        },
        
        getItemByVal: function(val) {
            var item = null;
            
            $.each(this.items, function(index, node) {
                if ($(node).attr('data-value') === val) {
                    item = node;
                    return false;
                } 
            });
            
            return item;
        },
        
        _createList: function() {
            this.list = this.get('list');
            
            if (!this.list) {
                this.list = $(this.get('listTemplate'));
                this.set('list', this.list, {
                    silent: true
                });
            }
            
            this.list.addClass('m-radio-list');
        },
        
        _createItems: function() {
            var items = this.get('items'),
                temp = this.get('itemTemplate'),
                html = '';
            
            //先移除原来列表
            if (this.items) {
                this.items.off().remove();
            }
            
            if (typeof items == 'string') {
                //如果是选择器
                this.items = this.list.find(items);
            } else if (S.isArray(items)) {
                //如果是数据数组              
                $.each(items, function(index, item) {
                    html += S.substitute(temp, item);
                });
                this.items = $(html);
                this.list.append(this.items);
            } else {
                //其他
                this.items = $(items);
            }
            
            //设置attrs
            this.set('items', this.items, {
                silent: true 
            });
            
            //添加列表
            this.items.addClass('m-radio-item');
        },
        
        _afterRadioItemsChange: function(e) {
            this.refresh();
        },
        
        _afterCheckedItemChange: function(e) {
            var node = $(e.newVal),
                prevNode = $(e.prevVal),
                value = e.newVal ? node.attr('data-value') : '',
                text = e.newVal ? node.attr('data-text') : '',
                index = e.newVal ? this.items.indexOf(e.newVal) : -1;
                
            this.set('value', value);
            this.set('text', text);
            this.set('index', index);
            
            node.addClass('m-radio-checked');
            prevNode.removeClass('m-radio-checked');
            
            //select facade
            //node: $节点
            //item: DOM节点
            //value: 值
            //text: 文案
            //index: 序号
            if (!e.selectSilent) {
                this.fire('select', {
                    node: node,
                    item: e.newVal,
                    value: value,
                    text: text,
                    index: index
                });
            }
        },
        
        _onRadioItemClick: function(e) {
            this.set('checkedItem', e.currentTarget);
        }
    
    });
    
    //单选列表
    var Radio = Base.extend([RadioExt], {
        
        render: function(parent) {
            this.refresh();
            parent = parent && $(parent);
            
            if (parent && parent[0]) {
                parent.append(this.list);
            }
            
            return this;
        },
        
        destructor: function() {
            this.destroyRadio.apply(this, arguments);
        }
    }, {
        
        name: 'Radio'
        
    });
    
    Radio.Ext = RadioExt;
    
    return Radio;
    
}, {
    requires: ['base']
});