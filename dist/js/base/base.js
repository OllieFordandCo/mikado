"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),Base=function(){function e(){_classCallCheck(this,e),this.w=window,this.doc=document,this.html=this.doc.documentElement,this.vendor_url="dist/js/vendor/",this.polyfills=[],this.dev=!0,this.polyfillsCount=0,this.dev&&(window.BaseDev=this.dev),this.setPolyfills(),this.init()}return _createClass(e,[{key:"loadCSS",value:function(e,t,n){function i(){o.addEventListener&&o.removeEventListener("load",i),o.media=n||"all"}var l=document,o=l.createElement("link"),a=void 0;if(t)a=t;else{var d=(l.body||l.getElementsByTagName("head")[0]).childNodes;a=d[d.length-1]}var r=l.styleSheets;o.rel="stylesheet",o.href=e,o.media="only x",window.addEventListener("DOMContentLoaded",function(){a.parentNode.insertBefore(o,t?a:a.nextSibling)});var s=function c(e){for(var t=o.href,n=r.length;n--;)if(r[n].href===t)return e();setTimeout(function(){c(e)})};return o.addEventListener&&o.addEventListener("load",i),o.onloadcssdefined=s,s(i),o}},{key:"addPolyfill",value:function(e){this.polyfills.push(e),this.polyfillsCount++}},{key:"setPolyfills",value:function(){var t=this,n=t.doc,i=t.w,l=document.createElement("img"),o=document.createElement("input"),a=n.createElement("div");"Promise"in i||t.addPolyfill("//cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js"),"scrollBehavior"in n.documentElement.style||t.addPolyfill(t.vendor_url+"smoothscroll.min.js"),"requestAnimationFrame"in i||t.addPolyfill(t.vendor_url+"raf.min.js"),"function"==typeof CustomEvent||t.addPolyfill(t.vendor_url+"custom-event.min.js"),"srcset"in l||t.addPolyfill(t.vendor_url+"picturefill.min.js"),"dataset"in a||t.addPolyfill(t.vendor_url+"dataset.min.js"),"classList"in a||t.addPolyfill(t.vendor_url+"domtokenlist.min.js"),"validity"in o&&"badInput"in o.validity&&"patternMismatch"in o.validity&&"rangeOverflow"in o.validity&&"rangeUnderflow"in o.validity&&"stepMismatch"in o.validity&&"tooLong"in o.validity&&"tooShort"in o.validity&&"typeMismatch"in o.validity&&"valid"in o.validity&&"valueMissing"in o.validity||t.addPolyfill(t.vendor_url+"domtokenlist.min.js"),e.logger(t.polyfills),e.logger(t.polyfillsCount),t.polyfills.length>0?t.polyfills.forEach(function(n){e.loadScript(n,function(){t.polyfillsCount--,0===t.polyfillsCount&&e.triggerEvent("polyfillReady")})}):e.triggerEvent("polyfillReady")}},{key:"updateBody",value:function(){window.bodyUpdate=!1,window.lastPageYOffset>0?document.documentElement.classList.add("scrolled"):document.documentElement.classList.remove("scrolled")}},{key:"bodyScroll",value:function(){window.lastPageYOffset=window.pageYOffset,base.requestBodyUpdate()}},{key:"requestBodyUpdate",value:function(){window.bodyUpdate||requestAnimationFrame(base.updateBody),window.bodyUpdate=!0}},{key:"dataCritical",value:function(){var t=document.querySelectorAll("img[data-critical]"),n=function(t){e.logger("Reveling Critical Image."),t=t instanceof HTMLImageElement?t:t.target,t.removeAttribute("data-critical"),t.style.willChange="auto"};t.length>0?[].slice.call(t).forEach(function(e){e.complete?n(e):(delete e.style.opacity,e.style.willChange="opacity",e.style.transition="opacity 800ms linear",e.addEventListener("load",n))}):e.logger("Info: No Critical Images Found.")}},{key:"loadDeferredStyles",value:function(){var t=this.doc,n=this;this.w.addEventListener("load",function(){var i=t.getElementById("deferred-styles");i?requestAnimationFrame(function(){setTimeout(function(){var t=document.createElement("div");t.innerHTML=i.textContent,document.body.appendChild(t),i.parentElement.removeChild(i),requestAnimationFrame(function(){setTimeout(function(){document.documentElement.className=document.documentElement.className.replace("css-loading","css-loaded"),setTimeout(function(){e.logger("Info: All styles loaded, wait and trigger load."),n.triggerLoad()},400)},0)})},0)}):(e.logger("Info: Deferred Styles not found, skipping to Base Load"),n.triggerLoad())})}},{key:"triggerLoad",value:function(){this.doc.addEventListener("afterLoad",function(){e.logger("Event: The base has been loaded!")}),e.triggerEvent("afterLoad")}},{key:"init",value:function(){var e=this,t=window;t.lastPageYOffset=0,t.bodyUpdate=!1,t.addEventListener("scroll",this.bodyScroll,!1),t.addEventListener("DOMContentLoaded",function(){e.loadDeferredStyles(),e.dataCritical()})}}],[{key:"logger",value:function(e){window.BaseDev&&console.log(e)}},{key:"loadScript",value:function(e,t,n){var i=document.getElementsByTagName("script")[0],l=document.createElement("script");l.src=e,n&&(l.id=n),"function"==typeof t&&(l.onload=t),i.parentNode.insertBefore(l,i)}},{key:"triggerEvent",value:function(t){var n=new CustomEvent(t);return document.dispatchEvent(n),e.logger(t),!1}}]),e}(),base=new Base;