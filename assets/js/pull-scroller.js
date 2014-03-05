KISSY.add(function(S, iScroll) {

var PullScroller = function() {
    var that = this;
    that.init.apply(that, arguments);
};

PullScroller.prototype = {
    init: function($_element, opts) {
        var that = this;
        var opts = opts || {};
        var loadingAct = opts.loadingAct;
        var scrollMain = opts.scrollMain || '.J_listScroller';
        var direction = opts.direction;

        that.$_element = $_element;
        that.opts = opts;
        that.isEnd = false; // 标识当前Scroller是否可以PullRefresh.
        that.scroll = new iScroll($_element.get(0), {
            onScrollEnd: function() {
                // do something
                if(that.isEnd) return;
                $_element.find('.J_scrollerTip').addClass('hidden');
            },

            onTouchEnd: function() {
                var self = this;

                var loadingContent = 
                    '<a class="J_loadingIcon loading-icon" style="display: block; padding: 10px 0; text-align: center; font-size: 13px;">' + 
                        //'<img src="http://img04.taobaocdn.com/tps/i4/T1PHL.XX4gXXaPT2Hb-24-24.gif" /> 努力加载中，请稍候…' + 
                        //'<img src="http://img01.taobaocdn.com/tps/i1/T1lBENXc8gXXaY1rfd-32-32.gif" style="vertical-align:middle;" /> 努力加载中，请稍候…' + 
                        '<img src="http://gtms01.alicdn.com/tps/i1/T1a901FzJdXXarDJrh-50-50.gif" style="vertical-align:middle;width:23px;" /> 努力加载中，请稍候…' + 
                    '</a>';

                if(that.opts.loadingContent) {
                    loadingContent = that.opts.loadingContent;
                }

                if(that.opts.loadingContentText) {
                    loadingContent = loadingContent.replace('努力加载中，请稍候…', that.opts.loadingContentText);
                }

                self.refresh(); // hack self.maxScrollY
                if(that.isEnd) return;

                if(direction === 'up') {
                    if(self.y > 0 && self.y >= (that.opts.threshold || 50)) {
                        if($_element.find(scrollMain).find('.J_loadingIcon').get(0)) {
                            return;
                        }

                        $_element.find(scrollMain).prepend(loadingContent);
                        $_element.find('.J_scrollerTip').addClass('hidden');
                        self.refresh(); // hack self.maxScrollY
                        loadingAct && loadingAct.call(that);
                    }

                    return;
                }
                
                if(self.y < 0 && self.y <= self.maxScrollY - (that.opts.threshold || 50)) {
                    if($_element.find(scrollMain).find('.J_loadingIcon').get(0)) {
                        return;
                    }

                    $_element.find(scrollMain).append(loadingContent);
                    $_element.find('.J_scrollerTip').addClass('hidden');
                    self.refresh(); // hack self.maxScrollY
                    loadingAct && loadingAct.call(that);
                }
            },
            
            onScrollMove: function() {
                var self = this;
                var pullContent = '<a class="scroller-tip J_scrollerTip hidden">' + 
                        '<s></s><span>加载更多…</span>' + 
                    '</a>';

                if(that.opts.pullContent) {
                    pullContent = that.opts.pullContent;
                }

                that.timer && clearTimeout(that.timer);
                if(that.isEnd) return;

                if(direction === 'up') {
                    that.timer = setTimeout(function() {
                        if(self.y > 0 && self.y >= (that.opts.threshold || 50)) {
                            if($_element.find(scrollMain).find('.J_loadingIcon').get(0)) {
                                return;
                            }

                            // dynamicly added pull tips
                            if(!$_element.find('.J_scrollerTip').get(0)) {
                                $_element.find(scrollMain).prepend(pullContent);
                            }

                            $_element.find('.J_scrollerTip').removeClass('hidden');
                            $_element.find('.J_scrollerTip').find('s').addClass('rotate');
                            $_element.find('.J_scrollerTip').find('span').html(opts.releaseText || '松开即可加载更多酒店...');
                        } else if(self.y > 0) {
                            if($_element.find(scrollMain).find('.J_loadingIcon').get(0)) {
                                return;
                            }

                            // dynamicly added pull tips
                            if(!$_element.find('.J_scrollerTip').get(0)) {
                                $_element.find(scrollMain).prepend(pullContent);
                            }

                            $_element.find('.J_scrollerTip').removeClass('hidden');
                            $_element.find('.J_scrollerTip').find('s').removeClass('rotate')
                            $_element.find('.J_scrollerTip').find('span').html(opts.pullText || '向上拉即可加载更多酒店...');
                        }
                    }, 2);

                    return;
                }

                that.timer = setTimeout(function() {
                    if(self.y < 0 && self.y <= self.maxScrollY - (that.opts.threshold || 50)) {
                        if($_element.find(scrollMain).find('.J_loadingIcon').get(0)) {
                            return;
                        }

                        // dynamicly added pull tips
                        if(!$_element.find('.J_scrollerTip').get(0)) {
                            $_element.find(scrollMain).append(pullContent);
                        }

                        $_element.find('.J_scrollerTip').removeClass('hidden');
                        $_element.find('.J_scrollerTip').find('s').addClass('rotate');
                        $_element.find('.J_scrollerTip').find('span').html(opts.releaseText || '松开即可加载更多酒店...');
                    } else if(self.y < 0) {
                        if($_element.find(scrollMain).find('.J_loadingIcon').get(0)) {
                            return;
                        }

                        $_element.find('.J_scrollerTip').removeClass('hidden');
                        $_element.find('.J_scrollerTip').find('s').removeClass('rotate')
                        $_element.find('.J_scrollerTip').find('span').html(opts.pullText || '向上拉即可加载更多酒店...');
                    }
                }, 20);
            },

            hideScrollbar: true
        });
    },

    hideLoading: function() {
        var that = this;
        var opts = that.opts;
        var scrollMain = opts.scrollMain || '.J_listScroller';
        that.$_element.find(scrollMain).find('.J_loadingIcon').remove();
        that.scroll.refresh(); // hack self.maxScrollY
    },

    disablePullRefresh: function() {
        var that = this;
        that.isEnd = true;
    },

    enablePullRefresh: function() {
        var that = this;
        that.isEnd = false;
    },

    refresh: function() {
        var that = this;
        that.scroll.refresh();
    },

    scrollToElement: function() {
        var that = this;
        that.scroll.scrollToElement.apply(that.scroll, arguments);
    }
};

return PullScroller;

}, {
    requires: ['iscroll-lite']
});
