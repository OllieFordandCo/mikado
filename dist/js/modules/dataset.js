Object.defineProperty(Element.prototype,"dataset",{get:function(){for(var t=Object.create(null),e=0;e<this.attributes.length;++e){var r=this.attributes[e];r.specified&&"data-"===r.name.substring(0,5)&&!function(e,r){var n=r.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()});t[n]=e.getAttribute("data-"+r),Object.defineProperty(t,n,{get:function(){return e.getAttribute("data-"+r)},set:function(t){e.setAttribute("data-"+r,t)}})}(this,r.name.substring(5))}return t}});