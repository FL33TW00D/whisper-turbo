(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[439,83],{4875:function(e,t){var n;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/!function(){"use strict";var r={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var i=typeof n;if("string"===i||"number"===i)e.push(n);else if(Array.isArray(n)){if(n.length){var a=o.apply(null,n);a&&e.push(a)}}else if("object"===i){if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]")){e.push(n.toString());continue}for(var s in n)r.call(n,s)&&n[s]&&e.push(s)}}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0!==(n=(function(){return o}).apply(t,[]))&&(e.exports=n)}()},820:function(e,t,n){"use strict";var r,o;e.exports=(null==(r=n.g.process)?void 0:r.env)&&"object"==typeof(null==(o=n.g.process)?void 0:o.env)?n.g.process:n(3488)},3575:function(e,t,n){"use strict";n.d(t,{ko:function(){return l.ko},Fd:function(){return l.Fd},Sj:function(){return c}});var r=n(1633),o=n(4499),i=n(9485),a=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function a(e){try{l(r.next(e))}catch(t){i(t)}}function s(e){try{l(r.throw(e))}catch(t){i(t)}}function l(e){var t;e.done?o(e.value):((t=e.value)instanceof n?t:new n(function(e){e(t)})).then(a,s)}l((r=r.apply(e,t||[])).next())})};class s{initSession(e,t){return a(this,void 0,void 0,function*(){return yield this.session.initSession(e,t)})}transcribe(e,t){return a(this,void 0,void 0,function*(){return null==this.session?i.x4.err(Error("Session not initialized")):t?this.session instanceof r.z?yield this.session.stream(e,t):yield this.session.stream(e,o.sj(t)):yield this.session.run(e)})}destroy(){null!==this.innerWorker&&(console.warn("Terminating worker"),this.innerWorker.terminate()),this.session=null}constructor(e,t){this.session=e,this.innerWorker=t||null}}var l=n(4042),u=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function a(e){try{l(r.next(e))}catch(t){i(t)}}function s(e){try{l(r.throw(e))}catch(t){i(t)}}function l(e){var t;e.done?o(e.value):((t=e.value)instanceof n?t:new n(function(e){e(t)})).then(a,s)}l((r=r.apply(e,t||[])).next())})};class c{loadModel(e,t,n){return u(this,void 0,void 0,function*(){let r=yield this.createSession(!0,e,n);return r.isErr?i.x4.err(r.error):(t(r.value),i.x4.ok(r.value))})}createSession(e,t,a){return u(this,void 0,void 0,function*(){if(e&&"undefined"!=typeof document){let l=new Worker(n.tu(new URL(n.p+n.u(83),n.b)),{type:void 0}),u=o.Ud(l),c=yield new u,d=yield c.initSession(t,o.sj(a)),[f,p]=d.repr;return"Err"===f?i.x4.err(Error("Session initialization failed: "+p.toString())):i.x4.ok(new s(c,l))}{let m=new r.z,v=yield m.initSession(t,a);return v.isErr?(console.error("Error initializing session: ",v),i.x4.err(v.error)):i.x4.ok(new s(m))}})}}class d{static start(){var e,t,n,r;return e=this,t=void 0,n=void 0,r=function*(){let e=yield navigator.mediaDevices.getUserMedia({audio:!0,video:!1}),t=new MediaRecorder(e,{mimeType:this.supportedMimes.find(e=>MediaRecorder.isTypeSupported(e))});console.log("Selected mime: ",t.mimeType);let n=[];t.addEventListener("dataavailable",e=>{n.push(e.data)});let r=new d(t,n);return r.recorder.start(),r},new(n||(n=Promise))(function(o,i){function a(e){try{l(r.next(e))}catch(t){i(t)}}function s(e){try{l(r.throw(e))}catch(t){i(t)}}function l(e){var t;e.done?o(e.value):((t=e.value)instanceof n?t:new n(function(e){e(t)})).then(a,s)}l((r=r.apply(e,t||[])).next())})}isRecording(){var e;return(null===(e=this.recorder)||void 0===e?void 0:e.state)==="recording"}stop(){return new Promise((e,t)=>{var n,r,o;null===(n=this.recorder)||void 0===n||n.addEventListener("error",e=>{t(e)}),null===(r=this.recorder)||void 0===r||r.addEventListener("stop",()=>{e()}),null===(o=this.recorder)||void 0===o||o.stop(),this.recorder=null})}getBlob(){return new Blob(this.audioChunks)}constructor(e,t){this.recorder=null,this.audioChunks=[],this.recorder=e,this.audioChunks=t}}d.supportedMimes=["audio/webm","audio/ogg"]},4042:function(e,t,n){"use strict";n.d(t,{Fd:function(){return a},Hn:function(){return s},ko:function(){return o}});var r,o,i=n(9485);(r=o||(o={})).WHISPER_TINY="tiny",r.WHISPER_BASE="base",r.WHISPER_SMALL="small",r.WHISPER_MEDIUM="medium",r.WHISPER_LARGE="large";let a=new Map([[o.WHISPER_TINY,51444634],[o.WHISPER_BASE,96834130],[o.WHISPER_SMALL,313018088],[o.WHISPER_MEDIUM,972263884],[o.WHISPER_LARGE,1954315876]]);class s{static fromDBModel(e,t){var n,r,o,a;return n=this,r=void 0,o=void 0,a=function*(){let n=yield t.getTokenizer(e.ID);if(n.isErr)return i.x4.err(n.error);let r=n.value.bytes;return i.x4.ok(new s(e.name,e.bytes,r))},new(o||(o=Promise))(function(e,t){function i(e){try{l(a.next(e))}catch(n){t(n)}}function s(e){try{l(a.throw(e))}catch(n){t(n)}}function l(t){var n;t.done?e(t.value):((n=t.value)instanceof o?n:new o(function(e){e(n)})).then(i,s)}l((a=a.apply(n,r||[])).next())})}constructor(e,t,n){this.name=e,this.data=t,this.tokenizer=n}}},1633:function(e,t,n){"use strict";n.d(t,{z:function(){return u}});var r=n(9232),o=n(4499),i=n(9485),a=n(4042),s=n(4671),l=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function a(e){try{l(r.next(e))}catch(t){i(t)}}function s(e){try{l(r.throw(e))}catch(t){i(t)}}function l(e){var t;e.done?o(e.value):((t=e.value)instanceof n?t:new n(function(e){e(t)})).then(a,s)}l((r=r.apply(e,t||[])).next())})};class u{initSession(e,t){return l(this,void 0,void 0,function*(){if(this.whisperSession)return i.x4.err(Error("Session already initialized. Call `destroy()` first."));let n=yield this.loadModel(e,t);if(n.isErr)return i.x4.err(n.error);let o=n.value;yield r.ZP();let a=new r.hE,s=yield a.setModel(o.data).setTokenizer(o.tokenizer).build();return this.whisperSession=s,i.x4.ok(void 0)})}loadModel(e,t){return l(this,void 0,void 0,function*(){let n=yield s.Z.create(),r=yield n.getModel(e,t);if(r.isErr)return i.x4.err(Error("Failed to load model ".concat(e," with error: ").concat(r.error)));let o=r.value,l=yield a.Hn.fromDBModel(o,n);if(l.isErr)return i.x4.err(Error("Failed to transmute model ".concat(e," with error: ").concat(l.error)));let u=l.value;return i.x4.ok(u)})}run(e){return l(this,void 0,void 0,function*(){return this.whisperSession?i.x4.ok((yield this.whisperSession.run(e))):i.x4.err(Error("The session is not initialized. Call `initSession()` method first."))})}stream(e,t){return l(this,void 0,void 0,function*(){return this.whisperSession?i.x4.ok((yield this.whisperSession.stream(e,t))):i.x4.err(Error("The session is not initialized. Call `initSession()` method first."))})}}"undefined"!=typeof self&&o.Jj(u)},9172:function(e){e.exports={style:{fontFamily:"'__VT323_2a9463', '__VT323_Fallback_2a9463'",fontWeight:400,fontStyle:"normal"},className:"__className_2a9463"}},3488:function(e){!function(){var t={229:function(e){var t,n,r,o=e.exports={};function i(){throw Error("setTimeout has not been defined")}function a(){throw Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:i}catch(e){t=i}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(r){n=a}}();var l=[],u=!1,c=-1;function d(){u&&r&&(u=!1,r.length?l=r.concat(l):c=-1,l.length&&f())}function f(){if(!u){var e=s(d);u=!0;for(var t=l.length;t;){for(r=l,l=[];++c<t;)r&&r[c].run();c=-1,t=l.length}r=null,u=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(r){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];l.push(new p(e,t)),1!==l.length||u||s(f)},p.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}},a=!0;try{t[e](i,i.exports,r),a=!1}finally{a&&delete n[e]}return i.exports}r.ab="//";var o=r(229);e.exports=o}()},6980:function(e,t,n){e.exports=n(493)},5084:function(e,t,n){"use strict";n.d(t,{Z:function(){return O}});var r=n(959),o=n(422),i=n(4875),a=n.n(i),s=!1;if("undefined"!=typeof window){var l={get passive(){s=!0;return}};window.addEventListener("testPassive",null,l),window.removeEventListener("testPassive",null,l)}var u="undefined"!=typeof window&&window.navigator&&window.navigator.platform&&(/iP(ad|hone|od)/.test(window.navigator.platform)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1),c=[],d=!1,f=-1,p=void 0,m=void 0,v=function(e){return c.some(function(t){return!!(t.options.allowTouchMove&&t.options.allowTouchMove(e))})},h=function(e){var t=e||window.event;return!!v(t.target)||t.touches.length>1||(t.preventDefault&&t.preventDefault(),!1)},y=function(e){if(void 0===m){var t=!!e&&!0===e.reserveScrollBarGap,n=window.innerWidth-document.documentElement.clientWidth;t&&n>0&&(m=document.body.style.paddingRight,document.body.style.paddingRight=n+"px")}void 0===p&&(p=document.body.style.overflow,document.body.style.overflow="hidden")},g=function(){void 0!==m&&(document.body.style.paddingRight=m,m=void 0),void 0!==p&&(document.body.style.overflow=p,p=void 0)},b=function(e,t){var n=e.targetTouches[0].clientY-f;return!v(e.target)&&(t&&0===t.scrollTop&&n>0?h(e):t&&t.scrollHeight-t.scrollTop<=t.clientHeight&&n<0?h(e):(e.stopPropagation(),!0))},w=function(e,t){if(!e){console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");return}!c.some(function(t){return t.targetElement===e})&&(c=[].concat(function(e){if(!Array.isArray(e))return Array.from(e);for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}(c),[{targetElement:e,options:t||{}}]),u?(e.ontouchstart=function(e){1===e.targetTouches.length&&(f=e.targetTouches[0].clientY)},e.ontouchmove=function(t){1===t.targetTouches.length&&b(t,e)},d||(document.addEventListener("touchmove",h,s?{passive:!1}:void 0),d=!0)):y(t))},E=function(e){if(!e){console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");return}c=c.filter(function(t){return t.targetElement!==e}),u?(e.ontouchstart=null,e.ontouchmove=null,d&&0===c.length&&(document.removeEventListener("touchmove",h,s?{passive:!1}:void 0),d=!1)):c.length||g()};function x(){return(x=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}n(820);var S=function(e){var t=e.classes,n=e.classNames,o=e.styles,i=e.id,s=e.closeIcon,l=e.onClick;return r.createElement("button",{id:i,className:a()(t.closeButton,null==n?void 0:n.closeButton),style:null==o?void 0:o.closeButton,onClick:l,"data-testid":"close-button"},s||r.createElement("svg",{className:null==n?void 0:n.closeIcon,style:null==o?void 0:o.closeIcon,width:28,height:28,viewBox:"0 0 36 36","data-testid":"close-icon"},r.createElement("path",{d:"M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"})))},k="undefined"!=typeof window,T=["input","select","textarea","a[href]","button","[tabindex]","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])'];function A(e){for(var t=document.activeElement,n=e.querySelectorAll(T.join(",")),r=[],o=0;o<n.length;o++){var i=n[o];(t===i||!i.disabled&&function(e){var t=parseInt(e.getAttribute("tabindex"),10);return isNaN(t)?e.getAttribute("contentEditable")?0:e.tabIndex:t}(i)>-1&&!(null===i.offsetParent||"hidden"===getComputedStyle(i).visibility)&&function(e){if("INPUT"!==e.tagName||"radio"!==e.type||!e.name)return!0;var t=(e.form||e.ownerDocument).querySelectorAll('input[type="radio"][name="'+e.name+'"]'),n=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return n===e||void 0===n&&t[0]===e}(i))&&r.push(i)}return r}var C=function(e){var t=e.container,n=e.initialFocusRef,o=(0,r.useRef)();return(0,r.useEffect)(function(){var e=function(e){(null==t?void 0:t.current)&&function(e,t){if(e&&"Tab"===e.key&&t&&t.contains&&t.contains(e.target)){var n=A(t),r=n[0],o=n[n.length-1];e.shiftKey&&e.target===r?(o.focus(),e.preventDefault()):e.shiftKey||e.target!==o||(r.focus(),e.preventDefault())}}(e,t.current)};if(k&&document.addEventListener("keydown",e),k&&(null==t?void 0:t.current)){var r=function(){-1!==T.findIndex(function(e){var t;return null==(t=document.activeElement)?void 0:t.matches(e)})&&(o.current=document.activeElement)};if(n)r(),requestAnimationFrame(function(){var e;null==(e=n.current)||e.focus()});else{var i=A(t.current);i[0]&&(r(),i[0].focus())}}return function(){if(k){var t;document.removeEventListener("keydown",e),null==(t=o.current)||t.focus()}}},[t,n]),null},I=[],P={add:function(e){I.push(e)},remove:function(e){I=I.filter(function(t){return t!==e})},isTopModal:function(e){return!!I.length&&I[I.length-1]===e}},L=function(e,t,n,o,i){var a=(0,r.useRef)(null);(0,r.useEffect)(function(){return t&&e.current&&o&&(a.current=e.current,w(e.current,{reserveScrollBarGap:i})),function(){a.current&&(E(a.current),a.current=null)}},[t,n,e,o,i])},M={root:"react-responsive-modal-root",overlay:"react-responsive-modal-overlay",overlayAnimationIn:"react-responsive-modal-overlay-in",overlayAnimationOut:"react-responsive-modal-overlay-out",modalContainer:"react-responsive-modal-container",modalContainerCenter:"react-responsive-modal-containerCenter",modal:"react-responsive-modal-modal",modalAnimationIn:"react-responsive-modal-modal-in",modalAnimationOut:"react-responsive-modal-modal-out",closeButton:"react-responsive-modal-closeButton"},O=r.forwardRef(function(e,t){var n,i,s,l,u=e.open,c=e.center,d=e.blockScroll,f=e.closeOnEsc,p=void 0===f||f,m=e.closeOnOverlayClick,v=void 0===m||m,h=e.container,y=e.showCloseIcon,g=e.closeIconId,b=e.closeIcon,w=e.focusTrapped,E=e.initialFocusRef,T=e.animationDuration,A=void 0===T?300:T,I=e.classNames,O=e.styles,R=e.role,N=e.ariaDescribedby,j=e.ariaLabelledby,z=e.containerId,_=e.modalId,D=e.onClose,H=e.onEscKeyDown,B=e.onOverlayClick,W=e.onAnimationEnd,$=e.children,F=e.reserveScrollBarGap,U=function(e,t={isStateful:!0}){let n=function(e=null){let[t,n]=r.useState(e),{current:o}=r.useRef({current:t});return Object.defineProperty(o,"current",{get:()=>t,set:e=>{Object.is(t,e)||(t=e,n(e))}}),o}(null),o=(0,r.useRef)(null),i=t.isStateful?n:o;return r.useEffect(()=>{e&&("function"==typeof e?e(i.current):e.current=i.current)}),i}(t),G=(0,r.useRef)(null),Y=(0,r.useRef)(null),Z=(0,r.useRef)(null);null===Z.current&&k&&(Z.current=document.createElement("div"));var q=(0,r.useState)(!1),K=q[0],J=q[1];(0,r.useEffect)(function(){return u&&P.add(G),function(){P.remove(G)}},[u,G]),L(G,u,K,void 0===d||d,F);var V=function(){!Z.current||h||document.body.contains(Z.current)||document.body.appendChild(Z.current),document.addEventListener("keydown",Q)},X=function(){Z.current&&!h&&document.body.contains(Z.current)&&document.body.removeChild(Z.current),document.removeEventListener("keydown",Q)},Q=function(e){27===e.keyCode&&P.isTopModal(G)&&(null==H||H(e),p&&D())};(0,r.useEffect)(function(){return function(){K&&X()}},[K]),(0,r.useEffect)(function(){u&&!K&&(J(!0),V())},[u]);var ee=function(){Y.current=!1},et=h||Z.current,en=u?null!=(n=null==I?void 0:I.overlayAnimationIn)?n:M.overlayAnimationIn:null!=(i=null==I?void 0:I.overlayAnimationOut)?i:M.overlayAnimationOut,er=u?null!=(s=null==I?void 0:I.modalAnimationIn)?s:M.modalAnimationIn:null!=(l=null==I?void 0:I.modalAnimationOut)?l:M.modalAnimationOut;return K&&et?o.createPortal(r.createElement("div",{className:a()(M.root,null==I?void 0:I.root),style:null==O?void 0:O.root,"data-testid":"root"},r.createElement("div",{className:a()(M.overlay,null==I?void 0:I.overlay),"data-testid":"overlay","aria-hidden":!0,style:x({animation:en+" "+A+"ms"},null==O?void 0:O.overlay)}),r.createElement("div",{ref:G,id:z,className:a()(M.modalContainer,c&&M.modalContainerCenter,null==I?void 0:I.modalContainer),style:null==O?void 0:O.modalContainer,"data-testid":"modal-container",onClick:function(e){if(null===Y.current&&(Y.current=!0),!Y.current){Y.current=null;return}null==B||B(e),v&&D(),Y.current=null}},r.createElement("div",{ref:U,className:a()(M.modal,null==I?void 0:I.modal),style:x({animation:er+" "+A+"ms"},null==O?void 0:O.modal),onMouseDown:ee,onMouseUp:ee,onClick:ee,onAnimationEnd:function(){u||J(!1),null==W||W()},id:_,role:void 0===R?"dialog":R,"aria-modal":"true","aria-labelledby":j,"aria-describedby":N,"data-testid":"modal",tabIndex:-1},(void 0===w||w)&&r.createElement(C,{container:U,initialFocusRef:void 0===E?void 0:E}),$,(void 0===y||y)&&r.createElement(S,{classes:M,classNames:I,styles:O,closeIcon:b,onClick:D,id:g})))),et):null})},4499:function(e,t,n){"use strict";n.d(t,{Jj:function(){return u},Ud:function(){return d},sj:function(){return v}});let r=Symbol("Comlink.proxy"),o=Symbol("Comlink.endpoint"),i=Symbol("Comlink.releaseProxy"),a=Symbol("Comlink.thrown"),s=e=>"object"==typeof e&&null!==e||"function"==typeof e,l=new Map([["proxy",{canHandle:e=>s(e)&&e[r],serialize(e){let{port1:t,port2:n}=new MessageChannel;return u(e,t),[n,[n]]},deserialize:e=>(e.start(),d(e))}],["throw",{canHandle:e=>s(e)&&a in e,serialize:({value:e})=>[e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[]],deserialize(e){if(e.isError)throw Object.assign(Error(e.value.message),e.value);throw e.value}}]]);function u(e,t=self){t.addEventListener("message",function n(r){let o;if(!r||!r.data)return;let{id:i,type:s,path:l}=Object.assign({path:[]},r.data),d=(r.data.argumentList||[]).map(y);try{let f=l.slice(0,-1).reduce((e,t)=>e[t],e),p=l.reduce((e,t)=>e[t],e);switch(s){case"GET":o=p;break;case"SET":f[l.slice(-1)[0]]=y(r.data.value),o=!0;break;case"APPLY":o=p.apply(f,d);break;case"CONSTRUCT":{let g=new p(...d);o=v(g)}break;case"ENDPOINT":{let{port1:b,port2:w}=new MessageChannel;u(e,w),m.set(b,[b]),o=b}break;case"RELEASE":o=void 0;break;default:return}}catch(E){o={value:E,[a]:0}}Promise.resolve(o).catch(e=>({value:e,[a]:0})).then(e=>{let[r,o]=h(e);t.postMessage(Object.assign(Object.assign({},r),{id:i}),o),"RELEASE"===s&&(t.removeEventListener("message",n),c(t))})}),t.start&&t.start()}function c(e){"MessagePort"===e.constructor.name&&e.close()}function d(e,t){return function e(t,n=[],r=function(){}){let a=!1,s=new Proxy(r,{get(r,o){if(f(a),o===i)return()=>g(t,{type:"RELEASE",path:n.map(e=>e.toString())}).then(()=>{c(t),a=!0});if("then"===o){if(0===n.length)return{then:()=>s};let l=g(t,{type:"GET",path:n.map(e=>e.toString())}).then(y);return l.then.bind(l)}return e(t,[...n,o])},set(e,r,o){f(a);let[i,s]=h(o);return g(t,{type:"SET",path:[...n,r].map(e=>e.toString()),value:i},s).then(y)},apply(r,i,s){f(a);let l=n[n.length-1];if(l===o)return g(t,{type:"ENDPOINT"}).then(y);if("bind"===l)return e(t,n.slice(0,-1));let[u,c]=p(s);return g(t,{type:"APPLY",path:n.map(e=>e.toString()),argumentList:u},c).then(y)},construct(e,r){f(a);let[o,i]=p(r);return g(t,{type:"CONSTRUCT",path:n.map(e=>e.toString()),argumentList:o},i).then(y)}});return s}(e,[],t)}function f(e){if(e)throw Error("Proxy has been released and is not useable")}function p(e){var t;let n=e.map(h);return[n.map(e=>e[0]),(t=n.map(e=>e[1]),Array.prototype.concat.apply([],t))]}let m=new WeakMap;function v(e){return Object.assign(e,{[r]:!0})}function h(e){for(let[t,n]of l)if(n.canHandle(e)){let[r,o]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},o]}return[{type:"RAW",value:e},m.get(e)||[]]}function y(e){switch(e.type){case"HANDLER":return l.get(e.name).deserialize(e.value);case"RAW":return e.value}}function g(e,t,n){return new Promise(r=>{let o=[,,,,].fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-");e.addEventListener("message",function t(n){n.data&&n.data.id&&n.data.id===o&&(e.removeEventListener("message",t),r(n.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),n)})}},1953:function(e,t,n){"use strict";let r,o;n.d(t,{x7:function(){return eo},ZP:function(){return ei}});var i,a=n(959);let s={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||s,u=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,f=(e,t)=>{let n="",r="",o="";for(let i in e){let a=e[i];"@"==i[0]?"i"==i[1]?n=i+" "+a+";":r+="f"==i[1]?f(a,i):i+"{"+f(a,"k"==i[1]?"":t)+"}":"object"==typeof a?r+=f(a,t?t.replace(/([^,])+/g,e=>i.replace(/(^:.*)|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=a&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=f.p?f.p(i,a):i+":"+a+";")}return n+(t&&o?t+"{"+o+"}":o)+r},p={},m=e=>{if("object"==typeof e){let t="";for(let n in e)t+=n+m(e[n]);return t}return e},v=(e,t,n,r,o)=>{var i,a;let s=m(e),l=p[s]||(p[s]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return"go"+n})(s));if(!p[l]){let v=s!==e?e:(e=>{let t,n,r=[{}];for(;t=u.exec(e.replace(c,""));)t[4]?r.shift():t[3]?(n=t[3].replace(d," ").trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(d," ").trim();return r[0]})(e);p[l]=f(o?{["@keyframes "+l]:v}:v,n?"":"."+l)}let h=n&&p.g?p.g:null;return n&&(p.g=p[l]),i=p[l],a=t,h?a.data=a.data.replace(h,i):-1===a.data.indexOf(i)&&(a.data=r?i+a.data:a.data+i),l},h=(e,t,n)=>e.reduce((e,r,o)=>{let i=t[o];if(i&&i.call){let a=i(n),s=a&&a.props&&a.props.className||/^go/.test(a)&&a;i=s?"."+s:a&&"object"==typeof a?a.props?"":f(a,""):!1===a?"":a}return e+r+(null==i?"":i)},"");function y(e){let t=this||{},n=e.call?e(t.p):e;return v(n.unshift?n.raw?h(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,l(t.target),t.g,t.o,t.k)}y.bind({g:1});let g,b,w,E=y.bind({k:1});function x(e,t){let n=this||{};return function(){let r=arguments;function o(i,a){let s=Object.assign({},i),l=s.className||o.className;n.p=Object.assign({theme:b&&b()},s),n.o=/ *go\d+/.test(l),s.className=y.apply(n,r)+(l?" "+l:""),t&&(s.ref=a);let u=e;return e[0]&&(u=s.as||e,delete s.as),w&&u[0]&&w(s),g(u,s)}return t?t(o):o}}var S=e=>"function"==typeof e,k=(e,t)=>S(e)?e(t):e,T=(r=0,()=>(++r).toString()),A=()=>{if(void 0===o&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");o=!e||e.matches}return o},C=new Map,I=e=>{if(C.has(e))return;let t=setTimeout(()=>{C.delete(e),R({type:4,toastId:e})},1e3);C.set(e,t)},P=e=>{let t=C.get(e);t&&clearTimeout(t)},L=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return t.toast.id&&P(t.toast.id),{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:n}=t;return e.toasts.find(e=>e.id===n.id)?L(e,{type:1,toast:n}):L(e,{type:0,toast:n});case 3:let{toastId:r}=t;return r?I(r):e.toasts.forEach(e=>{I(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},M=[],O={toasts:[],pausedAt:void 0},R=e=>{O=L(O,e),M.forEach(e=>{e(O)})},N={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},j=(e={})=>{let[t,n]=(0,a.useState)(O);(0,a.useEffect)(()=>(M.push(n),()=>{let e=M.indexOf(n);e>-1&&M.splice(e,1)}),[t]);let r=t.toasts.map(t=>{var n,r;return{...e,...e[t.type],...t,duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||N[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...t,toasts:r}},z=(e,t="blank",n)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...n,id:(null==n?void 0:n.id)||T()}),_=e=>(t,n)=>{let r=z(t,e,n);return R({type:2,toast:r}),r.id},D=(e,t)=>_("blank")(e,t);D.error=_("error"),D.success=_("success"),D.loading=_("loading"),D.custom=_("custom"),D.dismiss=e=>{R({type:3,toastId:e})},D.remove=e=>R({type:4,toastId:e}),D.promise=(e,t,n)=>{let r=D.loading(t.loading,{...n,...null==n?void 0:n.loading});return e.then(e=>(D.success(k(t.success,e),{id:r,...n,...null==n?void 0:n.success}),e)).catch(e=>{D.error(k(t.error,e),{id:r,...n,...null==n?void 0:n.error})}),e};var H=(e,t)=>{R({type:1,toast:{id:e,height:t}})},B=()=>{R({type:5,time:Date.now()})},W=e=>{let{toasts:t,pausedAt:n}=j(e);(0,a.useEffect)(()=>{if(n)return;let e=Date.now(),r=t.map(t=>{if(t.duration===1/0)return;let n=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(n<0){t.visible&&D.dismiss(t.id);return}return setTimeout(()=>D.dismiss(t.id),n)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[t,n]);let r=(0,a.useCallback)(()=>{n&&R({type:6,time:Date.now()})},[n]),o=(0,a.useCallback)((e,n)=>{let{reverseOrder:r=!1,gutter:o=8,defaultPosition:i}=n||{},a=t.filter(t=>(t.position||i)===(e.position||i)&&t.height),s=a.findIndex(t=>t.id===e.id),l=a.filter((e,t)=>t<s&&e.visible).length;return a.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[t]);return{toasts:t,handlers:{updateHeight:H,startPause:B,endPause:r,calculateOffset:o}}},$=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${E`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${E`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${E`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`} 1s linear infinite;
`,U=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${E`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,G=x("div")`
  position: absolute;
`,Y=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${E`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,q=({toast:e})=>{let{icon:t,type:n,iconTheme:r}=e;return void 0!==t?"string"==typeof t?a.createElement(Z,null,t):t:"blank"===n?null:a.createElement(Y,null,a.createElement(F,{...r}),"loading"!==n&&a.createElement(G,null,"error"===n?a.createElement($,{...r}):a.createElement(U,{...r})))},K=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,J=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,V=x("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,X=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Q=(e,t)=>{let n=e.includes("top")?1:-1,[r,o]=A()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[K(n),J(n)];return{animation:t?`${E(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${E(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ee=a.memo(({toast:e,position:t,style:n,children:r})=>{let o=e.height?Q(e.position||t||"top-center",e.visible):{opacity:0},i=a.createElement(q,{toast:e}),s=a.createElement(X,{...e.ariaProps},k(e.message,e));return a.createElement(V,{className:e.className,style:{...o,...n,...e.style}},"function"==typeof r?r({icon:i,message:s}):a.createElement(a.Fragment,null,i,s))});i=a.createElement,f.p=void 0,g=i,b=void 0,w=void 0;var et=({id:e,className:t,style:n,onHeightUpdate:r,children:o})=>{let i=a.useCallback(t=>{if(t){let n=()=>{r(e,t.getBoundingClientRect().height)};n(),new MutationObserver(n).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return a.createElement("div",{ref:i,className:t,style:n},o)},en=(e,t)=>{let n=e.includes("top"),r=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...r}},er=y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,eo=({reverseOrder:e,position:t="top-center",toastOptions:n,gutter:r,children:o,containerStyle:i,containerClassName:s})=>{let{toasts:l,handlers:u}=W(n);return a.createElement("div",{style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:s,onMouseEnter:u.startPause,onMouseLeave:u.endPause},l.map(n=>{let i=n.position||t,s=en(i,u.calculateOffset(n,{reverseOrder:e,gutter:r,defaultPosition:t}));return a.createElement(et,{id:n.id,key:n.id,onHeightUpdate:u.updateHeight,className:n.visible?er:"",style:s},"custom"===n.type?k(n.message,n):o?o(n):a.createElement(ee,{toast:n,position:i}))}))},ei=D},9485:function(e,t,n){"use strict";n.d(t,{x4:function(){return r.x4}}),n(4826);var r=n(3807);n(1866),n(113)}}]);