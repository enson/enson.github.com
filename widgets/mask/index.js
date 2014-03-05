/**
 * @fileoverview 
 * @author 虎牙<huya.nzb@alibaba-inc.com>
 * @module mask
 **/
KISSY.add(function (S, Base) {
    
    var docElem = $(document.documentElement);

    /**
     * 遮罩层扩展
     * @class MaskExt
     * @constructor
     */
    function MaskExt() {
        this.initMask.apply(this, arguments);
    }
    
    MaskExt.ATTRS = {
        
        //--------------- 可能会被父组件覆盖 ---------------
        
        /**
         * 遮罩层是否使用动画
         * @attribtue useAnim
         * @type String|Number 
         */
        useAnim: {},
        
        /**
         * 遮罩层的动画时间
         * @attribtue duration
         * @type Number 
         */
        duration: {
            value: 200
        },
        
        /**
         * 遮罩层的动画效果
         * @attribtue easing
         * @type String 
         */
        easing: {
            value: 'linear'
        },
        
        /**
         * 遮罩层的z-index
         * @attribtue zIndex
         * @type String|Number 
         */
        zIndex: {
            value: 100
        },
        
        /**
         * 遮罩层显隐性
         * @attribute visible
         * @type Boolean 
         */
        visible: {
            value: false
        },
        
        //--------------- 特有的属性 ---------------
        
        /**
         * 遮罩层的透明度
         * @attribtue opacity
         * @type String|Number 
         */
        opacity: {
            value: '0.7'
        },
        
        /**
         * 遮罩层Class
         * @attribute maskClass
         * @type String 
         */
        maskClass: {
            value: ''  
        },
        
        /**
         * 是否锁住屏幕
         * @attribtue disableScroll
         * @type Boolean
         */
        disableScroll: {
            value: true
        },
        
        /**
         * 点击Mask时隐藏 
         * @attribute clickHide
         * @type Boolean
         */
        clickHide: {
            value: true
        },
        
        /**
         * 父节点
         * @attribute maskParent
         * @type String|Node 
         */
        maskParent: {
            value: 'body'  
        },
        
        //TODO
        //使用absolute
        //window.innerHeight/window.innerWidth
        //resize orientchange
        /**
         * position
         * @attribute position
         * @type String
         */
        position: {
            value: 'fixed'
        }
    };
    
    S.augment(MaskExt, {
        
        //--------------------------- 公有方法 ---------------------------
        
        initMask: function() {
        },
        
        destroyMask: function() {
            if (this.mask) {
                this.mask.off().remove();
                delete this.mask;
            }
        },
        
        renderMask: function(bind) {
            var mask = $('<div class="m-mask m-mask-hidden"></div>'),
                cls = this.get('maskClass'),
                zIndex = Number(this.get('zIndex')),
                position = this.get('position'),
                cssPrefix = this.constructor.CSS_PREFIX;
            
            cls && mask.addClass(cls);
            cssPrefix && mask.addClass('m-' + cssPrefix + '-mask');
            
            mask.css({
                'position': position,
                'width': '100%',
                'height': '100%',
                'left': '0',
                'top': '0',
                'opacity': '0',
                'display': 'none',
                'z-index': zIndex - 1
            });
            
            $(this.get('maskParent')).append(mask);
            
            this.mask = mask;
            bind && this.bindMask();
            
            return this;
        },
        
        bindMask: function() {
            var clickHide = this.get('clickHide');
            
            this.on('afterVisibleChange', this._afterMaskVisibleChange);
            this.on('showMask', this._showMask);
            this.on('hideMask', this._hideMask);
            
            clickHide && this.mask.on('click', $.proxy(this.hideMask, this));
            
            return this;
        },
        
        syncMask: function() {
            
        },
        
        showMask: function(useAnim) {
            this.set('visible', true, {
                data: {
                    useAnim: useAnim
                }
            });
            return this;
        },
        
        hideMask: function(useAnim) {
            this.set('visible', false, {
                data: {
                    useAnim: useAnim
                }
            });
            return this;
        },
        
        disableScroll: function() {
            docElem.on('touchmove', this._preventScroll);
        },
        
        enableScroll: function() {
            docElem.off('touchmove', this._preventScroll);
        },
        
        //--------------------------- 私有方法 ---------------------------
        
        _getMaskCssCfg: function(show) {
            return {
                opacity: show ? this.get('opacity') : 0
            };
        },
        
        _showMask: function(e) {
            e = e || {};
            if (!this.mask) {
                this.renderMask();
            }
            this._uiMaskChange(1, e);
        },
        
        _hideMask: function(e) {
            e = e || {};
            if (this.mask && !e.preventMaskHide) {
                this._uiMaskChange(0, e);
            }
        },
        
        _uiMaskChange: function(show, e) {
            var self = this,
                useAnim = e.useAnim,
                cssCfg = this._getMaskCssCfg(show),
                duration = this.get('duration'),
                easing = this.get('easing'),
                disableScroll = this.get('disableScroll');
            
            function end() {
                !show && self.mask.css('display', 'none');
                disableScroll && self[show ? 'disableScroll' : 'enableScroll']();
                self.fire(show ? 'showMaskEnd' : 'hideMaskEnd', {
                    useAnim: useAnim
                });
            }
            
            show && self.mask.css('display', 'block');
            self.mask.toggleClass('m-mask-hidden', !show);
                
            if (useAnim) {
                this.mask.animate(cssCfg, duration, easing, end);
            } else {
                this.mask.css(cssCfg);
                end();
            }
        },
        
        _preventScroll: function(e) {
            e.preventDefault();
        },
        
        //--------------------------- 事件回调 ---------------------------
        
        _afterMaskVisibleChange: function(e) {
            var useAnim = this.get('useAnim');
            
            e.useAnim = useAnim === false ? false : (e.useAnim === false ? false : true);
            
            this.fire(e.newVal ? 'showMask' : 'hideMask', {
                useAnim: e.useAnim
            });
        }
        
    });
    
    var CONTENT_TEMP = '<div class="m-mask-content"></div>';
    
    var Mask = Base.extend([MaskExt], {
        
        show: function(useAnim) {
            return this.showMask(useAnim);
        },
        
        hide: function(useAnim) {
            return this.hideMask(useAnim);
        },
        
        render: function() {
            this.renderMask(true);
            this._renderContent();
            return this; 
        },
        
        destructor: function() {
            return this.destroyMask();  
        },
        
        _renderContent: function() {
            var content = this.get('content');
            
            if (content) {
                this.content = $(CONTENT_TEMP);
                this.content.append(content);
                this.mask.append(this.content);
                this._bindContent();
            }
        },
        
        _bindContent: function() {
            var clickHide = this.get('clickHide');
            
            /*this.content.on('click', function(e) {
                clickHide && e.stopPropagation(); 
            });*/
        }
    }, {
        
        ATTRS: {
            content: {}
        },
        
        name: 'Mask'
        
    });
    
    Mask.Ext = MaskExt;
    
    return Mask;
    
}, {
    requires: ['base']
});



