/*!
 * iScroll Lite base on iScroll v4.1.6 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){var q=Math,d=function(m){return m>>0;},u=(/webkit/i).test(navigator.appVersion)?"webkit":(/firefox/i).test(navigator.userAgent)?"Moz":"opera" in window?"O":"",v=(/android/gi).test(navigator.appVersion),i=(/iphone|ipad/gi).test(navigator.appVersion),c=(/playbook/gi).test(navigator.appVersion),n=(/hp-tablet/gi).test(navigator.appVersion),k="WebKitCSSMatrix" in window&&"m11" in new WebKitCSSMatrix(),t="ontouchstart" in window&&!n,f=u+"Transform" in document.documentElement.style,g=i||c,o=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(m){return setTimeout(m,17);};})(),l=(function(){return window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout;})(),h="onorientationchange" in window?"orientationchange":"resize",b=t?"touchstart":"mousedown",p=t?"touchmove":"mousemove",e=t?"touchend":"mouseup",s=t?"touchcancel":"mouseup",a="translate"+(k?"3d(":"("),j=k?",0)":")",r=function(x,m){var y=this,z=document,w;y.wrapper=typeof x=="object"?x:z.getElementById(x);y.wrapper.style.overflow="hidden";y.scroller=y.wrapper.children[0];y.options={hScroll:true,vScroll:true,x:0,y:0,bounce:true,bounceLock:false,momentum:true,lockDirection:true,useTransform:true,useTransition:false,onRefresh:null,onBeforeScrollStart:function(A){A.preventDefault();},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:null,onBeforeScrollEnd:null,onScrollEnd:null,onTouchEnd:null,onDestroy:null};for(w in m){y.options[w]=m[w];}y.x=y.options.x;y.y=y.options.y;y.options.useTransform=f?y.options.useTransform:false;y.options.hScrollbar=y.options.hScroll&&y.options.hScrollbar;y.options.vScrollbar=y.options.vScroll&&y.options.vScrollbar;y.options.useTransition=g&&y.options.useTransition;y.scroller.style[u+"TransitionProperty"]=y.options.useTransform?"-"+u.toLowerCase()+"-transform":"top left";y.scroller.style[u+"TransitionDuration"]="0";y.scroller.style[u+"TransformOrigin"]="0 0";if(y.options.useTransition){y.scroller.style[u+"TransitionTimingFunction"]="cubic-bezier(0.33,0.66,0.66,1)";}if(y.options.useTransform){y.scroller.style[u+"Transform"]=a+y.x+"px,"+y.y+"px"+j;}else{y.scroller.style.cssText+=";position:absolute;top:"+y.y+"px;left:"+y.x+"px";}y.refresh();y._bind(h,window);y._bind(b);if(!t){y._bind("mouseout",y.wrapper);}};r.prototype={enabled:true,x:0,y:0,steps:[],scale:1,handleEvent:function(w){var m=this;switch(w.type){case b:if(!t&&w.button!==0){return;}m._start(w);break;case p:m._move(w);break;case e:case s:m._end(w);break;case h:m._resize();break;case"mouseout":m._mouseout(w);break;case"webkitTransitionEnd":m._transitionEnd(w);break;}},_resize:function(){this.refresh();},_pos:function(m,w){m=this.hScroll?m:0;w=this.vScroll?w:0;if(this.options.useTransform){this.scroller.style[u+"Transform"]=a+m+"px,"+w+"px"+j+" scale("+this.scale+")";}else{m=d(m);w=d(w);this.scroller.style.left=m+"px";this.scroller.style.top=w+"px";}this.x=m;this.y=w;},_start:function(B){var A=this,w=t?B.touches[0]:B,z,m,C;if(!A.enabled){return;}if(A.options.onBeforeScrollStart){A.options.onBeforeScrollStart.call(A,B);}if(A.options.useTransition){A._transitionTime(0);}A.moved=false;A.animating=false;A.zoomed=false;A.distX=0;A.distY=0;A.absDistX=0;A.absDistY=0;A.dirX=0;A.dirY=0;if(A.options.momentum){if(A.options.useTransform){z=getComputedStyle(A.scroller,null)[u+"Transform"].replace(/[^0-9-.,]/g,"").split(",");m=z[4]*1;C=z[5]*1;}else{m=getComputedStyle(A.scroller,null).left.replace(/[^0-9-]/g,"")*1;C=getComputedStyle(A.scroller,null).top.replace(/[^0-9-]/g,"")*1;}if(m!=A.x||C!=A.y){if(A.options.useTransition){A._unbind("webkitTransitionEnd");}else{l(A.aniTime);}A.steps=[];A._pos(m,C);}}A.startX=A.x;A.startY=A.y;A.pointX=w.pageX;A.pointY=w.pageY;A.startTime=B.timeStamp||Date.now();if(A.options.onScrollStart){A.options.onScrollStart.call(A,B);}A._bind(p);A._bind(e);A._bind(s);},_move:function(B){var y=this,w=t?B.touches[0]:B,x=w.pageX-y.pointX,m=w.pageY-y.pointY,C=y.x+x,A=y.y+m,z=B.timeStamp||Date.now();if(y.options.onBeforeScrollMove){y.options.onBeforeScrollMove.call(y,B);}y.pointX=w.pageX;y.pointY=w.pageY;if(C>0||C<y.maxScrollX){C=y.options.bounce?y.x+(x/2):C>=0||y.maxScrollX>=0?0:y.maxScrollX;}if(A>0||A<y.maxScrollY){A=y.options.bounce?y.y+(m/2):A>=0||y.maxScrollY>=0?0:y.maxScrollY;}y.distX+=x;y.distY+=m;y.absDistX=q.abs(y.distX);y.absDistY=q.abs(y.distY);if(y.absDistX<6&&y.absDistY<6){return;}if(y.options.lockDirection){if(y.absDistX>y.absDistY+5){A=y.y;m=0;}else{if(y.absDistY>y.absDistX+5){C=y.x;x=0;}}}y.moved=true;y._pos(C,A);y.dirX=x>0?-1:x<0?1:0;y.dirY=m>0?-1:m<0?1:0;if(z-y.startTime>300){y.startTime=z;y.startX=y.x;y.startY=y.y;}if(y.options.onScrollMove){y.options.onScrollMove.call(y,B);}},_end:function(B){if(t&&B.touches.length!=0){return;}var z=this,F=t?B.changedTouches[0]:B,C,E,x={dist:0,time:0},m={dist:0,time:0},y=(B.timeStamp||Date.now())-z.startTime,D=z.x,A=z.y,w;z._unbind(p);z._unbind(e);z._unbind(s);if(z.options.onBeforeScrollEnd){z.options.onBeforeScrollEnd.call(z,B);}if(!z.moved){if(t){C=F.target;while(C.nodeType!=1){C=C.parentNode;}if(C.tagName!="SELECT"&&C.tagName!="INPUT"&&C.tagName!="TEXTAREA"){E=document.createEvent("MouseEvents");E.initMouseEvent("click",true,true,B.view,1,F.screenX,F.screenY,F.clientX,F.clientY,B.ctrlKey,B.altKey,B.shiftKey,B.metaKey,0,null);E._fake=true;C.dispatchEvent(E);}}z._resetPos(200);if(z.options.onTouchEnd){z.options.onTouchEnd.call(z,B);}return;}if(y<300&&z.options.momentum){x=D?z._momentum(D-z.startX,y,-z.x,z.scrollerW-z.wrapperW+z.x,z.options.bounce?z.wrapperW:0):x;m=A?z._momentum(A-z.startY,y,-z.y,(z.maxScrollY<0?z.scrollerH-z.wrapperH+z.y:0),z.options.bounce?z.wrapperH:0):m;D=z.x+x.dist;A=z.y+m.dist;if((z.x>0&&D>0)||(z.x<z.maxScrollX&&D<z.maxScrollX)){x={dist:0,time:0};}if((z.y>0&&A>0)||(z.y<z.maxScrollY&&A<z.maxScrollY)){m={dist:0,time:0};}}if(x.dist||m.dist){w=q.max(q.max(x.time,m.time),10);z.scrollTo(d(D),d(A),w);if(z.options.onTouchEnd){z.options.onTouchEnd.call(z,B);}return;}z._resetPos(200);if(z.options.onTouchEnd){z.options.onTouchEnd.call(z,B);}},_resetPos:function(x){var m=this,y=m.x>=0?0:m.x<m.maxScrollX?m.maxScrollX:m.x,w=m.y>=0||m.maxScrollY>0?0:m.y<m.maxScrollY?m.maxScrollY:m.y;if(y==m.x&&w==m.y){if(m.moved){if(m.options.onScrollEnd){m.options.onScrollEnd.call(m);}m.moved=false;}return;}m.scrollTo(y,w,x||0);},_mouseout:function(w){var m=w.relatedTarget;if(!m){this._end(w);return;}while(m=m.parentNode){if(m==this.wrapper){return;}}this._end(w);},_transitionEnd:function(w){var m=this;if(w.target!=m.scroller){return;}m._unbind("webkitTransitionEnd");m._startAni();},_startAni:function(){var B=this,w=B.x,m=B.y,z=Date.now(),A,y,x;if(B.animating){return;}if(!B.steps.length){B._resetPos(400);return;}A=B.steps.shift();if(A.x==w&&A.y==m){A.time=0;}B.animating=true;B.moved=true;if(B.options.useTransition){B._transitionTime(A.time);B._pos(A.x,A.y);B.animating=false;if(A.time){B._bind("webkitTransitionEnd");}else{B._resetPos(0);}return;}x=function(){var C=Date.now(),E,D;if(C>=z+A.time){B._pos(A.x,A.y);B.animating=false;if(B.options.onAnimationEnd){B.options.onAnimationEnd.call(B);}B._startAni();return;}C=(C-z)/A.time-1;y=q.sqrt(1-C*C);E=(A.x-w)*y+w;D=(A.y-m)*y+m;B._pos(E,D);if(B.animating){B.aniTime=o(x);}};x();},_transitionTime:function(m){this.scroller.style[u+"TransitionDuration"]=m+"ms";},_momentum:function(C,w,A,m,E){var B=0.0006,x=q.abs(C)/w,y=(x*x)/(2*B),D=0,z=0;if(C>0&&y>A){z=E/(6/(y/x*B));A=A+z;x=x*A/y;y=A;}else{if(C<0&&y>m){z=E/(6/(y/x*B));m=m+z;x=x*m/y;y=m;}}y=y*(C<0?-1:1);D=x/B;return{dist:y,time:d(D)};},_offset:function(m){var x=-m.offsetLeft,w=-m.offsetTop;while(m=m.offsetParent){x-=m.offsetLeft;w-=m.offsetTop;}return{left:x,top:w};},_bind:function(x,w,m){(w||this.scroller).addEventListener(x,this,!!m);},_unbind:function(x,w,m){(w||this.scroller).removeEventListener(x,this,!!m);},destroy:function(){var m=this;m.scroller.style[u+"Transform"]="";m._unbind(h,window);m._unbind(b);m._unbind(p);m._unbind(e);m._unbind(s);m._unbind("mouseout",m.wrapper);if(m.options.useTransition){m._unbind("webkitTransitionEnd");}if(m.options.onDestroy){m.options.onDestroy.call(m);}},refresh:function(){var m=this,w;m.wrapperW=m.wrapper.clientWidth;m.wrapperH=m.wrapper.clientHeight;m.scrollerW=m.scroller.offsetWidth;m.scrollerH=m.scroller.offsetHeight;m.maxScrollX=m.wrapperW-m.scrollerW;m.maxScrollY=m.wrapperH-m.scrollerH;m.dirX=0;m.dirY=0;m.hScroll=m.options.hScroll&&m.maxScrollX<0;m.vScroll=m.options.vScroll&&(!m.options.bounceLock&&!m.hScroll||m.scrollerH>m.wrapperH);w=m._offset(m.wrapper);m.wrapperOffsetLeft=-w.left;m.wrapperOffsetTop=-w.top;m.scroller.style[u+"TransitionDuration"]="0";m._resetPos(200);},scrollTo:function(m,E,D,C){var B=this,A=m,z,w;B.stop();if(!A.length){A=[{x:m,y:E,time:D,relative:C}];}for(z=0,w=A.length;z<w;z++){if(A[z].relative){A[z].x=B.x-A[z].x;A[z].y=B.y-A[z].y;}B.steps.push({x:A[z].x,y:A[z].y,time:A[z].time||0});}B._startAni();},scrollToElement:function(m,x){var w=this,y;m=m.nodeType?m:w.scroller.querySelector(m);if(!m){return;}y=w._offset(m);y.left+=w.wrapperOffsetLeft;y.top+=w.wrapperOffsetTop;y.left=y.left>0?0:y.left<w.maxScrollX?w.maxScrollX:y.left;y.top=y.top>0?0:y.top<w.maxScrollY?w.maxScrollY:y.top;x=x===undefined?q.max(q.abs(y.left)*2,q.abs(y.top)*2):x;w.scrollTo(y.left,y.top,x);},disable:function(){this.stop();this._resetPos(0);this.enabled=false;this._unbind(p);this._unbind(e);this._unbind(s);},enable:function(){this.enabled=true;},stop:function(){l(this.aniTime);this.steps=[];this.moved=false;this.animating=false;}};if(typeof exports!=="undefined"){exports.iScroll=r;}else{window.iScroll=r;}})();