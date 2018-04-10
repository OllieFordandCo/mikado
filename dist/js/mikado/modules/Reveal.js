"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),Reveal=function(){function e(){_classCallCheck(this,e),this.elements=[],this.init()}return _createClass(e,[{key:"isPartiallyVisible",value:function(e){var t=e.getBoundingClientRect(),n=t.top,l=t.bottom,i=t.height;return n+i>=0&&i+window.innerHeight>=l}},{key:"isFullyVisible",value:function(e){var t=e.getBoundingClientRect(),n=t.top,l=t.bottom;return n>=0&&l<=window.innerHeight}},{key:"reveal",value:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){if(reveal.elements.length>0)for(var e=reveal.elements.length;e>-1;e--)if(void 0!==reveal.elements[e]){var t=reveal.elements[e],n="full"===t.dataset.reveal?"isFullyVisible":"isPartiallyVisible";reveal[n](t)?(t.classList.add("element-visible"),"revealOnce"in t.dataset&&t.removeAttribute("data-reveal")):t.classList.remove("element-visible")}reveal.elements=document.querySelectorAll("[data-reveal]")})},{key:"init",value:function(){window.addEventListener("load",function(){reveal.elements=document.querySelectorAll("[data-reveal]"),console.log("Scroller active"),reveal.reveal(),window.onscrolling(function(){reveal.reveal()})},!1)}}]),e}();window.reveal=new Reveal;