class Base {
    constructor() {
        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.vendor_url = '/dist/js';

        var base = this;
        this.docReady(function() {
            base.loadPolyfill();
            base.bodyScrolled();
            base.loadDeferredStyles();
            base.dataCritical(true);
        });
    }

    docReady( cb ){
        if( document.body ){
            console.log('Info: Document is ready.');
            return cb();
        }
        setTimeout(function(){
            this.docReady( cb );
        });
    }

    loadCSS( href, before, media ){
        var doc = this.doc;
        var ss = doc.createElement( "link" );
        var ref;
        if( before ){
            ref = before;
        }
        else {
            var refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
            ref = refs[ refs.length - 1];
        }

        var sheets = doc.styleSheets;
        ss.rel = "stylesheet";
        ss.href = href;
        // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
        ss.media = "only x";

        // Inject link
        // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
        // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
        this.docReady( function(){
            ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
        });
        // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
        var onloadcssdefined = function( cb ){
            var resolvedHref = ss.href;
            var i = sheets.length;
            while( i-- ){
                if( sheets[ i ].href === resolvedHref ){
                    return cb();
                }
            }
            setTimeout(function() {
                onloadcssdefined( cb );
            });
        };

        function loadCB(){
            if( ss.addEventListener ){
                ss.removeEventListener( "load", loadCB );
            }
            ss.media = media || "all";
        }

        // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
        if( ss.addEventListener ){
            ss.addEventListener( "load", loadCB);
        }
        ss.onloadcssdefined = onloadcssdefined;
        onloadcssdefined( loadCB );
        return ss;
    };

    loadScript(url, cb) {
        var fjs = this.doc.getElementsByTagName('script')[0];
        var js = this.doc.createElement('script');
        js.src = url;
        if(typeof cb == "function") {
            js.onload = cb;
        }
        fjs.parentNode.insertBefore(js, fjs);
    };

    loadPolyfill() {
        var d = this.doc,
            w = this.w;
        ('Promise' in w) || this.loadScript(this.vendor_url+'promise.min.js'),
        ('scrollBehavior' in d.documentElement.style)  || this.loadScript(this.vendor_url+'smoothscroll.min.js'),
        ('requestAnimationFrame' in w) || this.loadScript(this.vendor_url+'raf.min.js'),
        ("function" == typeof CustomEvent) || this.loadScript(this.vendor_url+'custom-event.min.js'),
        ("srcset" in d.createElement("img")) || this.loadScript(this.vendor_url+'picturefill.min.js'),
        ('dataset' in d.createElement("div")) || this.loadScript(this.vendor_url+'dataset.min.js'),
        ("classList" in d.createElement("div")) || this.loadScript(this.vendor_url+'domtokenlist.min.js');
    }

    bodyScrolled() {
        var doc = this.doc;
        this.w.addEventListener("scroll", function () {
            if(this.pageYOffset > 0) {
                doc.documentElement.classList.add('scrolled');
            } else {
                doc.documentElement.classList.remove('scrolled');
            }
        });
    }

    dataCritical(init) {
        var images = document.querySelectorAll('img[data-critical]');
        var revealImage = function(ele){
            console.log('Reveling Critical Image.');
            ele = (ele instanceof HTMLImageElement) ? ele : ele.target;
            ele.removeAttribute('data-critical');
            ele.style.willChange = 'auto';
        };
        if(images.length > 0) {
            [].slice.call(images).forEach(function (image) {
                if (image.complete) {
                    revealImage(image);
                } else {
                    delete image.style.opacity;
                    image.style.willChange = 'opacity';
                    image.style.transition = 'opacity 800ms linear';

                    image.addEventListener('load', revealImage);
                }
            });
            /*
            if(init) {
                var base = this;
                base.w.addEventListener('load', function() {
                    base.dataCritical(false);
                });
            }*/
        } else {
            console.log('Info: No Critical Images Found.');
        }
    };

    loadDeferredStyles() {
        var doc = this.doc,
            base = this;
        this.w.addEventListener('load', function() {
            var t = doc.getElementById("deferred-styles");
            if(t) {
                window.requestAnimationFrame(function () {
                    window.setTimeout(function () {
                        var e = document.createElement("div");
                        e.innerHTML = t.textContent, document.body.appendChild(e), t.parentElement.removeChild(t);
                        window.requestAnimationFrame(function () {
                            window.setTimeout(function () {
                                document.documentElement.className = document.documentElement.className.replace("css-loading", "css-loaded");
                                setTimeout(function() {
                                    console.log('Info: All styles loaded, wait and trigger load.');
                                    base.triggerLoad();
                                }, 400);
                            }, 0);
                        });
                    }, 0);
                });
            } else {
                console.log('Info: Deferred Styles not found, skipping to Base Load');
                base.triggerLoad();
            }
        });
    }

    triggerLoad() {
        this.doc.addEventListener('afterLoad', function() {
            console.log('Event: The base has been loaded!');
        });
        this.doc.dispatchEvent(new CustomEvent('afterLoad', {'bubbles': true, 'cancelable': false}));
    }

}

const base = new Base();