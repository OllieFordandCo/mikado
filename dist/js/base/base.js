"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),Base=function(){function e(){_classCallCheck(this,e),this.w=window,this.doc=document,this.html=this.doc.documentElement,this.polyfills=[],this.polyfillsCount=0,this.now=Date.now||function(){return(new Date).getTime()};var t=void 0,n={dev:!0,web_components:!1,vendor_url:"dist/js/vendor/"},o=window.baseConfig||{};for(t in n)t in o||(o[t]=n[t]);this.config=o,this.setPolyfills(),this.init()}return _createClass(e,[{key:"throttle",value:function(e,t,n){var o,i,l,a,r=this,d=0;n||(n={});var s=function(){d=n.leading===!1?0:r.now(),o=null,a=e.apply(i,l),o||(i=l=null)},c=function(){var c=r.now();d||n.leading!==!1||(d=c);var u=t-(c-d);return i=this,l=arguments,u<=0||u>t?(o&&(clearTimeout(o),o=null),d=c,a=e.apply(i,l),o||(i=l=null)):o||n.trailing===!1||(o=setTimeout(s,u)),a};return c.cancel=function(){clearTimeout(o),d=0,o=i=l=null},c}},{key:"restArguments",value:function(e,t){return t=null==t?e.length-1:+t,function(){for(var n=Math.max(arguments.length-t,0),o=Array(n),i=0;i<n;i++)o[i]=arguments[i+t];switch(t){case 0:return e.call(this,o);case 1:return e.call(this,arguments[0],o);case 2:return e.call(this,arguments[0],arguments[1],o)}var l=Array(t+1);for(i=0;i<t;i++)l[i]=arguments[i];return l[t]=o,e.apply(this,l)}}},{key:"delay",value:function(e,t,n){return setTimeout(function(){return e.apply(null,n)},t)}},{key:"debounce",value:function(e,t,n){var o,i,l=this,a=function(t,n){o=null,n&&(i=e.apply(t,n))},r=restArguments(function(r){if(o&&clearTimeout(o),n){var d=!o;o=setTimeout(a,t),d&&(i=e.apply(this,r))}else o=l.delay(a,t,this,r);return i});return r.cancel=function(){clearTimeout(o),o=null},r}},{key:"loadCSS",value:function(e,t,n){function o(){l.addEventListener&&l.removeEventListener("load",o),l.media=n||"all"}var i=document,l=i.createElement("link"),a=void 0;if(t)a=t;else{var r=(i.body||i.getElementsByTagName("head")[0]).childNodes;a=r[r.length-1]}var d=i.styleSheets;l.rel="stylesheet",l.href=e,l.media="only x",window.addEventListener("DOMContentLoaded",function(){a.parentNode.insertBefore(l,t?a:a.nextSibling)});var s=function c(e){for(var t=l.href,n=d.length;n--;)if(d[n].href===t)return e();setTimeout(function(){c(e)})};return l.addEventListener&&l.addEventListener("load",o),l.onloadcssdefined=s,s(o),l}},{key:"addPolyfill",value:function(e){this.polyfills.push(e),this.polyfillsCount++}},{key:"setPolyfills",value:function(){var t=this,n=t.doc,o=t.w,i=document.createElement("img"),l=document.createElement("input"),a=n.createElement("div");"Promise"in o||t.addPolyfill("//cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js"),"scrollBehavior"in n.documentElement.style||t.addPolyfill(t.config.vendor_url+"smoothscroll.min.js"),"requestAnimationFrame"in o||t.addPolyfill(t.config.vendor_url+"raf.min.js"),"function"==typeof CustomEvent||t.addPolyfill(t.config.vendor_url+"custom-event.min.js"),"srcset"in i||t.addPolyfill(t.config.vendor_url+"picturefill.min.js"),"dataset"in a||t.addPolyfill(t.config.vendor_url+"dataset.min.js"),"classList"in a||t.addPolyfill(t.config.vendor_url+"domtokenlist.min.js"),"validity"in l&&"badInput"in l.validity&&"patternMismatch"in l.validity&&"rangeOverflow"in l.validity&&"rangeUnderflow"in l.validity&&"stepMismatch"in l.validity&&"tooLong"in l.validity&&"tooShort"in l.validity&&"typeMismatch"in l.validity&&"valid"in l.validity&&"valueMissing"in l.validity||t.addPolyfill(t.config.vendor_url+"validityState-polyfill.min.js"),e.logger(t.polyfills),e.logger(t.polyfillsCount),t.polyfills.length>0?t.polyfills.forEach(function(n){e.loadScript(n,function(){t.polyfillsCount--,0===t.polyfillsCount&&e.triggerEvent("polyfillReady")})}):e.triggerEvent("polyfillReady")}},{key:"polyfillWebComponents",value:function(){window.WebComponents=window.WebComponents||{};var t="webcomponents-loader.js",n=[];if("import"in document.createElement("link")||n.push("hi"),(!("attachShadow"in Element.prototype&&"getRootNode"in Element.prototype)||window.ShadyDOM&&window.ShadyDOM.force)&&n.push("sd"),window.customElements&&!window.customElements.forcePolyfill||n.push("ce"),"content"in document.createElement("template")&&window.Promise&&Array.from&&document.createDocumentFragment().cloneNode()instanceof DocumentFragment||(n=["lite"]),n.length){var o=document.querySelector('script[src*="'+t+'"]'),i=document.createElement("script"),l=base.config.vendor_url+"webcomponents-"+n.join("-")+".js";i.src=o.src.replace(t,l),"loading"===document.readyState&&"import"in document.createElement("link")?document.write(i.outerHTML):document.head.appendChild(i)}else{var a=function(){requestAnimationFrame(function(){window.WebComponents.ready=!0,e.logger("WebComponentReady"),document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))})};"loading"!==document.readyState?a():document.addEventListener("readystatechange",function r(){a(),document.removeEventListener("readystatechange",r)})}}},{key:"updateBody",value:function(){window.bodyUpdate=!1;var e=document.documentElement;window.lastPageYOffset>50?e.classList.add("scrolled"):e.classList.remove("scrolled")}},{key:"bodyScroll",value:function(){window.lastPageYOffset=window.pageYOffset,base.requestBodyUpdate()}},{key:"requestBodyUpdate",value:function(){window.bodyUpdate||requestAnimationFrame(base.updateBody),window.bodyUpdate=!0}},{key:"dataCritical",value:function(){var t=document.querySelectorAll("img[data-critical]"),n=function(t){e.logger("Reveling Critical Image."),t=t instanceof HTMLImageElement?t:t.target,t.removeAttribute("data-critical"),t.style.willChange="auto"};t.length>0?[].slice.call(t).forEach(function(e){e.complete?n(e):(delete e.style.opacity,e.style.willChange="opacity",e.style.transition="opacity 800ms linear",e.addEventListener("load",n))}):e.logger("Info: No Critical Images Found.")}},{key:"loadDeferredStyles",value:function(){var t=this.doc,n=this;this.w.addEventListener("load",function(){var o=t.getElementById("deferred-styles");o?requestAnimationFrame(function(){setTimeout(function(){var t=document.createElement("div");t.innerHTML=o.textContent,document.body.appendChild(t),o.parentElement.removeChild(o),requestAnimationFrame(function(){setTimeout(function(){document.documentElement.className=document.documentElement.className.replace("css-loading","css-loaded"),setTimeout(function(){e.logger("Info: All styles loaded, wait and trigger load."),n.triggerLoad()},400)},0)})},0)}):(e.logger("Info: Deferred Styles not found, skipping to Base Load"),n.triggerLoad())})}},{key:"triggerLoad",value:function(){this.doc.addEventListener("afterLoad",function(){e.logger("Event: The base has been loaded!")}),e.triggerEvent("afterLoad")}},{key:"init",value:function(){var e=this,t=window;t.lastPageYOffset=0,t.bodyUpdate=!1,this.config.web_components&&this.polyfillWebComponents(),t.addEventListener("scroll",this.bodyScroll,!1),t.addEventListener("DOMContentLoaded",function(){e.loadDeferredStyles(),e.dataCritical()})}}],[{key:"logger",value:function(e){var t=window.baseConfig||{dev:!1};t.dev&&console.log(e)}},{key:"findAncestor",value:function(e,t){for(;(e=e.parentElement)&&e.className.indexOf(t)>-1;);return e}},{key:"forEach",value:function(e,t,n){for(var o=0;o<e.length;o++)t.call(n,o,e[o])}},{key:"loadScript",value:function(e,t,n){var o=document.getElementsByTagName("script")[0],i=document.createElement("script");i.src=e,n&&(i.id=n),"function"==typeof t&&(i.onload=t),o.parentNode.insertBefore(i,o)}},{key:"triggerEvent",value:function(t){var n=new CustomEvent(t);return document.dispatchEvent(n),e.logger(t),!1}}]),e}(),base=new Base;