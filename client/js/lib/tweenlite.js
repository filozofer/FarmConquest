/*!
 * VERSION: beta 1.9.3
 * DATE: 2013-04-03
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
(function(a){"use strict";var f,g,h,i,j,b=a.GreenSockGlobals||a,c=function(a){var e,c=a.split("."),d=b;for(e=0;c.length>e;e++)d[c[e]]=d=d[c[e]]||{};return d},d=c("com.greensock"),e=function(){},k={},l=function(d,e,f,g){this.sc=k[d]?k[d].sc:[],k[d]=this,this.gsClass=null,this.func=f;var h=[];this.check=function(i){for(var n,o,p,q,j=e.length,m=j;--j>-1;)(n=k[e[j]]||new l(e[j],[])).gsClass?(h[j]=n.gsClass,m--):i&&n.sc.push(this);if(0===m&&f)for(o=("com.greensock."+d).split("."),p=o.pop(),q=c(o.join("."))[p]=this.gsClass=f.apply(f,h),g&&(b[p]=q,"function"==typeof define&&define.amd?define((a.GreenSockAMDPath?a.GreenSockAMDPath+"/":"")+d.split(".").join("/"),[],function(){return q}):"undefined"!=typeof module&&module.exports&&(module.exports=q)),j=0;this.sc.length>j;j++)this.sc[j].check()},this.check(!0)},m=a._gsDefine=function(a,b,c,d){return new l(a,b,c,d)},n=d._class=function(a,b,c){return b=b||function(){},m(a,[],function(){return b},c),b};m.globals=b;var o=[0,0,1,1],p=[],q=n("easing.Ease",function(a,b,c,d){this._func=a,this._type=c||0,this._power=d||0,this._params=b?o.concat(b):o},!0),r=q.map={},s=q.register=function(a,b,c,e){for(var i,j,k,l,f=b.split(","),g=f.length,h=(c||"easeIn,easeOut,easeInOut").split(",");--g>-1;)for(j=f[g],i=e?n("easing."+j,null,!0):d.easing[j]||{},k=h.length;--k>-1;)l=h[k],r[j+"."+l]=r[l+j]=i[l]=a.getRatio?a:a[l]||new a};for(h=q.prototype,h._calcEnd=!1,h.getRatio=function(a){if(this._func)return this._params[0]=a,this._func.apply(null,this._params);var b=this._type,c=this._power,d=1===b?1-a:2===b?a:.5>a?2*a:2*(1-a);return 1===c?d*=d:2===c?d*=d*d:3===c?d*=d*d*d:4===c&&(d*=d*d*d*d),1===b?1-d:2===b?d:.5>a?d/2:1-d/2},f=["Linear","Quad","Cubic","Quart","Quint,Strong"],g=f.length;--g>-1;)h=f[g]+",Power"+g,s(new q(null,null,1,g),h,"easeOut",!0),s(new q(null,null,2,g),h,"easeIn"+(0===g?",easeNone":"")),s(new q(null,null,3,g),h,"easeInOut");r.linear=d.easing.Linear.easeIn,r.swing=d.easing.Quad.easeInOut;var t=n("events.EventDispatcher",function(a){this._listeners={},this._eventTarget=a||this});h=t.prototype,h.addEventListener=function(a,b,c,d,e){e=e||0;var h,k,f=this._listeners[a],g=0;for(null==f&&(this._listeners[a]=f=[]),k=f.length;--k>-1;)h=f[k],h.c===b&&h.s===c?f.splice(k,1):0===g&&e>h.pr&&(g=k+1);f.splice(g,0,{c:b,s:c,up:d,pr:e}),this!==i||j||i.wake()},h.removeEventListener=function(a,b){var d,c=this._listeners[a];if(c)for(d=c.length;--d>-1;)if(c[d].c===b)return c.splice(d,1),void 0},h.dispatchEvent=function(a){var c,d,e,b=this._listeners[a];if(b)for(c=b.length,d=this._eventTarget;--c>-1;)e=b[c],e.up?e.c.call(e.s||d,{type:a,target:d}):e.c.call(e.s||d)};var u=a.requestAnimationFrame,v=a.cancelAnimationFrame,w=Date.now||function(){return(new Date).getTime()};for(f=["ms","moz","webkit","o"],g=f.length;--g>-1&&!u;)u=a[f[g]+"RequestAnimationFrame"],v=a[f[g]+"CancelAnimationFrame"]||a[f[g]+"CancelRequestAnimationFrame"];n("Ticker",function(a,b){var g,h,k,l,m,c=this,d=w(),f=b!==!1&&u,n=function(a){c.time=(w()-d)/1e3,(!g||c.time>=m||a===!0)&&(c.frame++,m=c.time+l,c.dispatchEvent("tick")),a!==!0&&(k=h(n))};t.call(c),this.time=this.frame=0,this.tick=function(){n(!0)},this.sleep=function(){null!=k&&(f&&v?v(k):clearTimeout(k),h=e,k=null,c===i&&(j=!1))},this.wake=function(){k&&c.sleep(),h=0===g?e:f&&u?u:function(a){return setTimeout(a,1e3*l)},c===i&&(j=!0),n()},this.fps=function(a){return arguments.length?(g=a,l=1/(g||60),m=this.time+l,c.wake(),void 0):g},this.useRAF=function(a){return arguments.length?(f=a,c.fps(g),void 0):f},c.fps(a),setTimeout(function(){f&&!k&&c.useRAF(!1)},1e3)}),h=d.Ticker.prototype=new d.events.EventDispatcher,h.constructor=d.Ticker;var x=n("core.Animation",function(a,b){if(this.vars=b||{},this._duration=this._totalDuration=a||0,this._delay=Number(this.vars.delay)||0,this._timeScale=1,this._active=this.vars.immediateRender===!0,this.data=this.vars.data,this._reversed=this.vars.reversed===!0,K){j||i.wake();var c=this.vars.useFrames?J:K;c.add(this,c._time),this.vars.paused&&this.paused(!0)}});i=x.ticker=new d.Ticker,h=x.prototype,h._dirty=h._gc=h._initted=h._paused=!1,h._totalTime=h._time=0,h._rawPrevTime=-1,h._next=h._last=h._onUpdate=h._timeline=h.timeline=null,h._paused=!1,h.play=function(a,b){return arguments.length&&this.seek(a,b),this.reversed(!1),this.paused(!1)},h.pause=function(a,b){return arguments.length&&this.seek(a,b),this.paused(!0)},h.resume=function(a,b){return arguments.length&&this.seek(a,b),this.paused(!1)},h.seek=function(a,b){return this.totalTime(Number(a),b!==!1)},h.restart=function(a,b){return this.reversed(!1),this.paused(!1),this.totalTime(a?-this._delay:0,b!==!1)},h.reverse=function(a,b){return arguments.length&&this.seek(a||this.totalDuration(),b),this.reversed(!0),this.paused(!1)},h.render=function(){},h.invalidate=function(){return this},h._enabled=function(a,b){return j||i.wake(),this._gc=!a,this._active=a&&!this._paused&&this._totalTime>0&&this._totalTime<this._totalDuration,b!==!0&&(a&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!a&&this.timeline&&this._timeline._remove(this,!0)),!1},h._kill=function(){return this._enabled(!1,!1)},h.kill=function(a,b){return this._kill(a,b),this},h._uncache=function(a){for(var b=a?this:this.timeline;b;)b._dirty=!0,b=b.timeline;return this},h.eventCallback=function(a,b,c,d){if(null==a)return null;if("on"===a.substr(0,2)){var f,e=this.vars;if(1===arguments.length)return e[a];if(null==b)delete e[a];else if(e[a]=b,e[a+"Params"]=c,e[a+"Scope"]=d,c)for(f=c.length;--f>-1;)"{self}"===c[f]&&(c=e[a+"Params"]=c.concat(),c[f]=this);"onUpdate"===a&&(this._onUpdate=b)}return this},h.delay=function(a){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+a-this._delay),this._delay=a,this):this._delay},h.duration=function(a){return arguments.length?(this._duration=this._totalDuration=a,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==a&&this.totalTime(this._totalTime*(a/this._duration),!0),this):(this._dirty=!1,this._duration)},h.totalDuration=function(a){return this._dirty=!1,arguments.length?this.duration(a):this._totalDuration},h.time=function(a,b){return arguments.length?(this._dirty&&this.totalDuration(),a>this._duration&&(a=this._duration),this.totalTime(a,b)):this._time},h.totalTime=function(a,b){if(j||i.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>a&&(a+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var c=this._totalDuration,d=this._timeline;if(a>c&&(a=c),this._startTime=(this._paused?this._pauseTime:d._time)-(this._reversed?c-a:a)/this._timeScale,d._dirty||this._uncache(!1),!d._active)for(;d._timeline;)d.totalTime(d._totalTime,!0),d=d._timeline}this._gc&&this._enabled(!0,!1),this._totalTime!==a&&this.render(a,b,!1)}return this},h.startTime=function(a){return arguments.length?(a!==this._startTime&&(this._startTime=a,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,a-this._delay)),this):this._startTime},h.timeScale=function(a){if(!arguments.length)return this._timeScale;if(a=a||1e-6,this._timeline&&this._timeline.smoothChildTiming){var b=this._pauseTime,c=b||0===b?b:this._timeline.totalTime();this._startTime=c-(c-this._startTime)*this._timeScale/a}return this._timeScale=a,this._uncache(!1)},h.reversed=function(a){return arguments.length?(a!=this._reversed&&(this._reversed=a,this.totalTime(this._totalTime,!0)),this):this._reversed},h.paused=function(a){if(!arguments.length)return this._paused;if(a!=this._paused&&this._timeline){j||a||i.wake();var b=this._timeline.rawTime(),c=b-this._pauseTime;!a&&this._timeline.smoothChildTiming&&(this._startTime+=c,this._uncache(!1)),this._pauseTime=a?b:null,this._paused=a,this._active=!a&&this._totalTime>0&&this._totalTime<this._totalDuration,a||0===c||0===this._duration||this.render(this._time,!0,!0)}return this._gc&&!a&&this._enabled(!0,!1),this};var y=n("core.SimpleTimeline",function(a){x.call(this,0,a),this.autoRemoveChildren=this.smoothChildTiming=!0});h=y.prototype=new x,h.constructor=y,h.kill()._gc=!1,h._first=h._last=null,h._sortChildren=!1,h.add=function(a,b){var e,f;if(a._startTime=Number(b||0)+a._delay,a._paused&&this!==a._timeline&&(a._pauseTime=a._startTime+(this.rawTime()-a._startTime)/a._timeScale),a.timeline&&a.timeline._remove(a,!0),a.timeline=a._timeline=this,a._gc&&a._enabled(!0,!0),e=this._last,this._sortChildren)for(f=a._startTime;e&&e._startTime>f;)e=e._prev;return e?(a._next=e._next,e._next=a):(a._next=this._first,this._first=a),a._next?a._next._prev=a:this._last=a,a._prev=e,this._timeline&&this._uncache(!0),this},h.insert=h.add,h._remove=function(a,b){return a.timeline===this&&(b||a._enabled(!1,!0),a.timeline=null,a._prev?a._prev._next=a._next:this._first===a&&(this._first=a._next),a._next?a._next._prev=a._prev:this._last===a&&(this._last=a._prev),this._timeline&&this._uncache(!0)),this},h.render=function(a,b,c){var e,d=this._first;for(this._totalTime=this._time=this._rawPrevTime=a;d;)e=d._next,(d._active||a>=d._startTime&&!d._paused)&&(d._reversed?d.render((d._dirty?d.totalDuration():d._totalDuration)-(a-d._startTime)*d._timeScale,b,c):d.render((a-d._startTime)*d._timeScale,b,c)),d=e},h.rawTime=function(){return j||i.wake(),this._totalTime};var z=n("TweenLite",function(a,b,c){if(x.call(this,b,c),null==a)throw"Cannot tween a null target.";this.target=a="string"!=typeof a?a:z.selector(a)||a;var f,g,h,d=a.jquery||"function"==typeof a.each&&a[0]&&a[0].nodeType&&a[0].style,e=this.vars.overwrite;if(this._overwrite=e=null==e?I[z.defaultOverwrite]:"number"==typeof e?e>>0:I[e],(d||a instanceof Array)&&"number"!=typeof a[0])for(this._targets=h=d&&!a.slice?B(a):a.slice(0),this._propLookup=[],this._siblings=[],f=0;h.length>f;f++)g=h[f],g?"string"!=typeof g?"function"==typeof g.each&&g[0]&&g[0].nodeType&&g[0].style?(h.splice(f--,1),this._targets=h=h.concat(B(g))):(this._siblings[f]=L(g,this,!1),1===e&&this._siblings[f].length>1&&M(g,this,null,1,this._siblings[f])):(g=h[f--]=z.selector(g),"string"==typeof g&&h.splice(f+1,1)):h.splice(f--,1);else this._propLookup={},this._siblings=L(a,this,!1),1===e&&this._siblings.length>1&&M(a,this,null,1,this._siblings);(this.vars.immediateRender||0===b&&0===this._delay&&this.vars.immediateRender!==!1)&&this.render(-this._delay,!1,!0)},!0),A=function(a){return"function"==typeof a.each&&a[0]&&a[0].nodeType&&a[0].style},B=function(a){var b=[];return a.each(function(){b.push(this)}),b},C=function(a,b){var d,c={};for(d in a)H[d]||d in b&&"x"!==d&&"y"!==d&&"width"!==d&&"height"!==d&&"className"!==d||!(!E[d]||E[d]&&E[d]._autoCSS)||(c[d]=a[d],delete a[d]);a.css=c};h=z.prototype=new x,h.constructor=z,h.kill()._gc=!1,h.ratio=0,h._firstPT=h._targets=h._overwrittenProps=h._startAt=null,h._notifyPluginsOfEnabled=!1,z.version="1.9.3",z.defaultEase=h._ease=new q(null,null,1,1),z.defaultOverwrite="auto",z.ticker=i,z.autoSleep=!0,z.selector=a.$||a.jQuery||function(b){return a.$?(z.selector=a.$,a.$(b)):a.document?a.document.getElementById("#"===b.charAt(0)?b.substr(1):b):b};var D=z._internals={},E=z._plugins={},F=z._tweenLookup={},G=0,H=D.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1},I={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},J=x._rootFramesTimeline=new y,K=x._rootTimeline=new y;K._startTime=i.time,J._startTime=i.frame,K._active=J._active=!0,x._updateRoot=function(){if(K.render((i.time-K._startTime)*K._timeScale,!1,!1),J.render((i.frame-J._startTime)*J._timeScale,!1,!1),!(i.frame%120)){var a,b,c;for(c in F){for(b=F[c].tweens,a=b.length;--a>-1;)b[a]._gc&&b.splice(a,1);0===b.length&&delete F[c]}if(c=K._first,(!c||c._paused)&&z.autoSleep&&!J._first&&1===i._listeners.tick.length){for(;c&&c._paused;)c=c._next;c||i.sleep()}}},i.addEventListener("tick",x._updateRoot);var L=function(a,b,c){var e,f,d=a._gsTweenID;if(F[d||(a._gsTweenID=d="t"+G++)]||(F[d]={target:a,tweens:[]}),b&&(e=F[d].tweens,e[f=e.length]=b,c))for(;--f>-1;)e[f]===b&&e.splice(f,1);return F[d].tweens},M=function(a,b,c,d,e){var f,g,h,i;if(1===d||d>=4){for(i=e.length,f=0;i>f;f++)if((h=e[f])!==b)h._gc||h._enabled(!1,!1)&&(g=!0);else if(5===d)break;return g}var n,j=b._startTime+1e-10,k=[],l=0,m=0===b._duration;for(f=e.length;--f>-1;)(h=e[f])===b||h._gc||h._paused||(h._timeline!==b._timeline?(n=n||N(b,0,m),0===N(h,n,m)&&(k[l++]=h)):j>=h._startTime&&h._startTime+h.totalDuration()/h._timeScale+1e-10>j&&((m||!h._initted)&&2e-10>=j-h._startTime||(k[l++]=h)));for(f=l;--f>-1;)h=k[f],2===d&&h._kill(c,a)&&(g=!0),(2!==d||!h._firstPT&&h._initted)&&h._enabled(!1,!1)&&(g=!0);return g},N=function(a,b,c){for(var d=a._timeline,e=d._timeScale,f=a._startTime;d._timeline;){if(f+=d._startTime,e*=d._timeScale,d._paused)return-100;d=d._timeline}return f/=e,f>b?f-b:c&&f===b||!a._initted&&2e-10>f-b?1e-10:(f+=a.totalDuration()/a._timeScale/e)>b?0:f-b-1e-10};h._init=function(){var e,f,g,h,a=this.vars,b=this._overwrittenProps,c=this._duration,d=a.ease;if(a.startAt){if(a.startAt.overwrite=0,a.startAt.immediateRender=!0,this._startAt=z.to(this.target,0,a.startAt),a.immediateRender&&(this._startAt=null,0===this._time&&0!==c))return}else if(a.runBackwards&&a.immediateRender&&0!==c)if(this._startAt)this._startAt.render(-1,!0),this._startAt=null;else if(0===this._time){g={};for(h in a)H[h]&&"autoCSS"!==h||(g[h]=a[h]);return g.overwrite=0,this._startAt=z.to(this.target,0,g),void 0}if(this._ease=d?d instanceof q?a.easeParams instanceof Array?d.config.apply(d,a.easeParams):d:"function"==typeof d?new q(d,a.easeParams):r[d]||z.defaultEase:z.defaultEase,this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(e=this._targets.length;--e>-1;)this._initProps(this._targets[e],this._propLookup[e]={},this._siblings[e],b?b[e]:null)&&(f=!0);else f=this._initProps(this.target,this._propLookup,this._siblings,b);if(f&&z._onPluginEvent("_onInitAllProps",this),b&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),a.runBackwards)for(g=this._firstPT;g;)g.s+=g.c,g.c=-g.c,g=g._next;this._onUpdate=a.onUpdate,this._initted=!0},h._initProps=function(a,b,c,d){var e,f,g,h,i,j,k;if(null==a)return!1;this.vars.css||a.style&&a.nodeType&&E.css&&this.vars.autoCSS!==!1&&C(this.vars,a);for(e in this.vars){if(H[e]){if(("onStartParams"===e||"onUpdateParams"===e||"onCompleteParams"===e||"onReverseCompleteParams"===e||"onRepeatParams"===e)&&(i=this.vars[e]))for(f=i.length;--f>-1;)"{self}"===i[f]&&(i=this.vars[e]=i.concat(),i[f]=this)}else if(E[e]&&(h=new E[e])._onInitTween(a,this.vars[e],this)){for(this._firstPT=j={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:!0,n:e,pg:!0,pr:h._priority},f=h._overwriteProps.length;--f>-1;)b[h._overwriteProps[f]]=this._firstPT;(h._priority||h._onInitAllProps)&&(g=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=b[e]=j={_next:this._firstPT,t:a,p:e,f:"function"==typeof a[e],n:e,pg:!1,pr:0},j.s=j.f?a[e.indexOf("set")||"function"!=typeof a["get"+e.substr(3)]?e:"get"+e.substr(3)]():parseFloat(a[e]),k=this.vars[e],j.c="string"==typeof k&&"="===k.charAt(1)?parseInt(k.charAt(0)+"1",10)*Number(k.substr(2)):Number(k)-j.s||0;j&&j._next&&(j._next._prev=j)}return d&&this._kill(d,a)?this._initProps(a,b,c,d):this._overwrite>1&&this._firstPT&&c.length>1&&M(a,this,b,this._overwrite,c)?(this._kill(b,a),this._initProps(a,b,c,d)):g},h.render=function(a,b,c){var e,f,g,d=this._time;if(a>=this._duration)this._totalTime=this._time=this._duration,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(e=!0,f="onComplete"),0===this._duration&&((0===a||0>this._rawPrevTime)&&this._rawPrevTime!==a&&(c=!0),this._rawPrevTime=a);else if(1e-7>a)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===this._duration&&this._rawPrevTime>0)&&(f="onReverseComplete",e=this._reversed),0>a?(this._active=!1,0===this._duration&&(this._rawPrevTime>=0&&(c=!0),this._rawPrevTime=a)):this._initted||(c=!0);else if(this._totalTime=this._time=a,this._easeType){var h=a/this._duration,i=this._easeType,j=this._easePower;(1===i||3===i&&h>=.5)&&(h=1-h),3===i&&(h*=2),1===j?h*=h:2===j?h*=h*h:3===j?h*=h*h*h:4===j&&(h*=h*h*h*h),this.ratio=1===i?1-h:2===i?h:.5>a/this._duration?h/2:1-h/2}else this.ratio=this._ease.getRatio(a/this._duration);if(this._time!==d||c){if(!this._initted){if(this._init(),!this._initted)return;this._time&&!e?this.ratio=this._ease.getRatio(this._time/this._duration):e&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._active||this._paused||(this._active=!0),0===d&&(this._startAt&&(a>=0?this._startAt.render(a,b,c):f||(f="_dummyGS")),this.vars.onStart&&(0!==this._time||0===this._duration)&&(b||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||p))),g=this._firstPT;g;)g.f?g.t[g.p](g.c*this.ratio+g.s):g.t[g.p]=g.c*this.ratio+g.s,g=g._next;this._onUpdate&&(0>a&&this._startAt&&this._startAt.render(a,b,c),b||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||p)),f&&(this._gc||(0>a&&this._startAt&&!this._onUpdate&&this._startAt.render(a,b,c),e&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!b&&this.vars[f]&&this.vars[f].apply(this.vars[f+"Scope"]||this,this.vars[f+"Params"]||p)))}},h._kill=function(a,b){if("all"===a&&(a=null),null==a&&(null==b||b===this.target))return this._enabled(!1,!1);b="string"!=typeof b?b||this._targets||this.target:z.selector(b)||b;var c,d,e,f,g,h,i,j;if((b instanceof Array||A(b))&&"number"!=typeof b[0])for(c=b.length;--c>-1;)this._kill(a,b[c])&&(h=!0);else{if(this._targets){for(c=this._targets.length;--c>-1;)if(b===this._targets[c]){g=this._propLookup[c]||{},this._overwrittenProps=this._overwrittenProps||[],d=this._overwrittenProps[c]=a?this._overwrittenProps[c]||{}:"all";break}}else{if(b!==this.target)return!1;g=this._propLookup,d=this._overwrittenProps=a?this._overwrittenProps||{}:"all"}if(g){i=a||g,j=a!==d&&"all"!==d&&a!==g&&(null==a||a._tempKill!==!0);for(e in i)(f=g[e])&&(f.pg&&f.t._kill(i)&&(h=!0),f.pg&&0!==f.t._overwriteProps.length||(f._prev?f._prev._next=f._next:f===this._firstPT&&(this._firstPT=f._next),f._next&&(f._next._prev=f._prev),f._next=f._prev=null),delete g[e]),j&&(d[e]=1);this._firstPT||this._enabled(!1,!1)}}return h},h.invalidate=function(){return this._notifyPluginsOfEnabled&&z._onPluginEvent("_onDisable",this),this._firstPT=null,this._overwrittenProps=null,this._onUpdate=null,this._startAt=null,this._initted=this._active=this._notifyPluginsOfEnabled=!1,this._propLookup=this._targets?{}:[],this},h._enabled=function(a,b){if(j||i.wake(),a&&this._gc){var d,c=this._targets;if(c)for(d=c.length;--d>-1;)this._siblings[d]=L(c[d],this,!0);else this._siblings=L(this.target,this,!0)}return x.prototype._enabled.call(this,a,b),this._notifyPluginsOfEnabled&&this._firstPT?z._onPluginEvent(a?"_onEnable":"_onDisable",this):!1},z.to=function(a,b,c){return new z(a,b,c)},z.from=function(a,b,c){return c.runBackwards=!0,c.immediateRender=0!=c.immediateRender,new z(a,b,c)},z.fromTo=function(a,b,c,d){return d.startAt=c,d.immediateRender=0!=d.immediateRender&&0!=c.immediateRender,new z(a,b,d)},z.delayedCall=function(a,b,c,d,e){return new z(b,0,{delay:a,onComplete:b,onCompleteParams:c,onCompleteScope:d,onReverseComplete:b,onReverseCompleteParams:c,onReverseCompleteScope:d,immediateRender:!1,useFrames:e,overwrite:0})},z.set=function(a,b){return new z(a,0,b)},z.killTweensOf=z.killDelayedCallsTo=function(a,b){for(var c=z.getTweensOf(a),d=c.length;--d>-1;)c[d]._kill(b,a)},z.getTweensOf=function(a){if(null==a)return[];a="string"!=typeof a?a:z.selector(a)||a;var b,c,d,e;if((a instanceof Array||A(a))&&"number"!=typeof a[0]){for(b=a.length,c=[];--b>-1;)c=c.concat(z.getTweensOf(a[b]));for(b=c.length;--b>-1;)for(e=c[b],d=b;--d>-1;)e===c[d]&&c.splice(b,1)}else for(c=L(a).concat(),b=c.length;--b>-1;)c[b]._gc&&c.splice(b,1);return c};var O=n("plugins.TweenPlugin",function(a,b){this._overwriteProps=(a||"").split(","),this._propName=this._overwriteProps[0],this._priority=b||0,this._super=O.prototype},!0);if(h=O.prototype,O.version="1.9.1",O.API=2,h._firstPT=null,h._addTween=function(a,b,c,d,e,f){var g,h;null!=d&&(g="number"==typeof d||"="!==d.charAt(1)?Number(d)-c:parseInt(d.charAt(0)+"1",10)*Number(d.substr(2)))&&(this._firstPT=h={_next:this._firstPT,t:a,p:b,s:c,c:g,f:"function"==typeof a[b],n:e||b,r:f},h._next&&(h._next._prev=h))},h.setRatio=function(a){for(var d,b=this._firstPT,c=1e-6;b;)d=b.c*a+b.s,b.r?d=d+(d>0?.5:-.5)>>0:c>d&&d>-c&&(d=0),b.f?b.t[b.p](d):b.t[b.p]=d,b=b._next},h._kill=function(a){var d,b=this._overwriteProps,c=this._firstPT;if(null!=a[this._propName])this._overwriteProps=[];else for(d=b.length;--d>-1;)null!=a[b[d]]&&b.splice(d,1);for(;c;)null!=a[c.n]&&(c._next&&(c._next._prev=c._prev),c._prev?(c._prev._next=c._next,c._prev=null):this._firstPT===c&&(this._firstPT=c._next)),c=c._next;return!1},h._roundProps=function(a,b){for(var c=this._firstPT;c;)(a[this._propName]||null!=c.n&&a[c.n.split(this._propName+"_").join("")])&&(c.r=b),c=c._next},z._onPluginEvent=function(a,b){var d,e,f,g,h,c=b._firstPT;if("_onInitAllProps"===a){for(;c;){for(h=c._next,e=f;e&&e.pr>c.pr;)e=e._next;(c._prev=e?e._prev:g)?c._prev._next=c:f=c,(c._next=e)?e._prev=c:g=c,c=h}c=b._firstPT=f}for(;c;)c.pg&&"function"==typeof c.t[a]&&c.t[a]()&&(d=!0),c=c._next;return d},O.activate=function(a){for(var b=a.length;--b>-1;)a[b].API===O.API&&(E[(new a[b])._propName]=a[b]);return!0},m.plugin=function(a){if(!(a&&a.propName&&a.init&&a.API))throw"illegal plugin definition.";var h,b=a.propName,c=a.priority||0,d=a.overwriteProps,e={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},f=n("plugins."+b.charAt(0).toUpperCase()+b.substr(1)+"Plugin",function(){O.call(this,b,c),this._overwriteProps=d||[]},a.global===!0),g=f.prototype=new O(b);g.constructor=f,f.API=a.API;for(h in e)"function"==typeof a[h]&&(g[e[h]]=a[h]);return f.version=a.version,O.activate([f]),f},f=a._gsQueue){for(g=0;f.length>g;g++)f[g]();for(h in k)k[h].func||a.console.log("GSAP encountered missing dependency: com.greensock."+h)}j=!1})(window);