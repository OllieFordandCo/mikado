class Base {
    constructor() {
        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.polyfills = [];
        this.polyfillsCount = 0;

        let prop;
        
        let baseConfigDefaults = {
            dev: true,
            web_components: false,
            vendor_url: 'dist/js/vendor/'
        };

        let baseConfig = window.baseConfig || {};

        for(prop in baseConfigDefaults){
            if(!(prop in baseConfig)){
                baseConfig[prop] = baseConfigDefaults[prop];
            }
        }

        this.config = baseConfig;

        this.setPolyfills();
        this.init();
    }

    static logger(message) {
        let config = window.baseConfig || { dev: false};
        if(config.dev) {
            console.log(message);
        }
    }

    static findAncestor (el, cls) {
        while ((el = el.parentElement) && el.className.indexOf(cls) > -1);
        return el;
    }

    static forEach(array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };

    loadCSS( href, before, media ){
        let doc = document;
        let ss = doc.createElement( "link" );
        let ref;
        if( before ){
            ref = before;
        }
        else {
            let refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
            ref = refs[ refs.length - 1];
        }

        let sheets = doc.styleSheets;
        ss.rel = "stylesheet";
        ss.href = href;
        // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
        ss.media = "only x";

        // Inject link
        // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
        // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
        window.addEventListener('DOMContentLoaded', function(){
            ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
        });
        // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
        let onloadcssdefined = function( cb ){
            let resolvedHref = ss.href;
            let i = sheets.length;
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

   static loadScript(url, cb, id) {
        let fjs = document.getElementsByTagName('script')[0];
        let js = document.createElement('script');
        js.src = url;
        if(id) {
            js.id = id;
        }
        if(typeof cb === "function") {
            js.onload = cb;
        }
        fjs.parentNode.insertBefore(js, fjs);
    };

    addPolyfill(url) {
        this.polyfills.push(url);
        this.polyfillsCount++;
    }

    setPolyfills() {
        let base = this, d = base.doc, w = base.w, img = document.createElement('img'), input = document.createElement('input'), div = d.createElement("div");
        ('Promise' in w) || base.addPolyfill('//cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js'),
        ('scrollBehavior' in d.documentElement.style) || base.addPolyfill(base.config.vendor_url+'smoothscroll.min.js'),
        ('requestAnimationFrame' in w) || base.addPolyfill(base.config.vendor_url+'raf.min.js'),
        ("function" === typeof CustomEvent) || base.addPolyfill(base.config.vendor_url+'custom-event.min.js'),
        ("srcset" in img) || base.addPolyfill(base.config.vendor_url+'picturefill.min.js'),
        ('dataset' in div) || base.addPolyfill(base.config.vendor_url+'dataset.min.js'),
        ("classList" in div) || base.addPolyfill(base.config.vendor_url+'domtokenlist.min.js'),
        ('validity' in input && 'badInput' in input.validity && 'patternMismatch' in input.validity && 'rangeOverflow' in input.validity && 'rangeUnderflow' in input.validity && 'stepMismatch' in input.validity && 'tooLong' in input.validity && 'tooShort' in input.validity && 'typeMismatch' in input.validity && 'valid' in input.validity && 'valueMissing' in input.validity) || base.addPolyfill(base.config.vendor_url+'validityState-polyfill.min.js');

        Base.logger(base.polyfills);
        Base.logger(base.polyfillsCount);

        if(base.polyfills.length > 0) {
            base.polyfills.forEach(function (url) {
                Base.loadScript(url, function() {
                    base.polyfillsCount--;
                    if(base.polyfillsCount === 0) {
                        Base.triggerEvent('polyfillReady');
                    }
                });
            });
        } else {
            Base.triggerEvent('polyfillReady');
        }

    }

    polyfillWebComponents() {
        'use strict';
        // global for (1) existence means `WebComponentsReady` will fire,
        // (2) WebComponents.ready == true means event has fired.
        window.WebComponents = window.WebComponents || {};
        var name = 'webcomponents-loader.js';
        // Feature detect which polyfill needs to be imported.
        var polyfills = [];
        if (!('import' in document.createElement('link'))) {
            polyfills.push('hi');
        }
        if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
            (window.ShadyDOM && window.ShadyDOM.force)) {
            polyfills.push('sd');
        }
        if (!window.customElements || window.customElements.forcePolyfill) {
            polyfills.push('ce');
        }
        // NOTE: any browser that does not have template or ES6 features
        // must load the full suite (called `lite` for legacy reasons) of polyfills.
        if (!('content' in document.createElement('template')) || !window.Promise || !Array.from ||
                // Edge has broken fragment cloning which means you cannot clone template.content
            !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment)) {
            polyfills = ['lite'];
        }

        if (polyfills.length) {
            var script = document.querySelector('script[src*="' + name +'"]');
            var newScript = document.createElement('script');
            // Load it from the right place.
            var replacement = base.config.vendor_url+'webcomponents-' + polyfills.join('-') + '.js';
            newScript.src = script.src.replace(name, replacement);
            // NOTE: this is required to ensure the polyfills are loaded before
            // *native* html imports load on older Chrome versions. This *is* CSP
            // compliant since CSP rules must have allowed this script to run.
            // In all other cases, this can be async.
            if (document.readyState === 'loading' && ('import' in document.createElement('link'))) {
                document.write(newScript.outerHTML);
            } else {
                document.head.appendChild(newScript);
            }
        } else {
            // Ensure `WebComponentsReady` is fired also when there are no polyfills loaded.
            // however, we have to wait for the document to be in 'interactive' state,
            // otherwise a rAF may fire before scripts in <body>

            var fire = function() {
                requestAnimationFrame(function() {
                    window.WebComponents.ready = true;
                    Base.logger('WebComponentReady');
                    document.dispatchEvent(new CustomEvent('WebComponentsReady', {bubbles: true}));
                });
            };

            if (document.readyState !== 'loading') {
                fire();
            } else {
                document.addEventListener('readystatechange', function wait() {
                    fire();
                    document.removeEventListener('readystatechange', wait);
                });
            }
        }
    }

    static triggerEvent(name) {
        let event = new CustomEvent(name);
        document.dispatchEvent(event);
        Base.logger(name);
        return false;
    }

    updateBody() {
        window.bodyUpdate = false;
        if(window.lastPageYOffset > 0) {
            document.documentElement.classList.add('scrolled');
        } else {
            document.documentElement.classList.remove('scrolled');
        }
    }


    bodyScroll() {
        window.lastPageYOffset = window.pageYOffset;
        base.requestBodyUpdate();
    }

    requestBodyUpdate() {
        if(!window.bodyUpdate) {
            requestAnimationFrame(base.updateBody);
        }
        window.bodyUpdate = true;
    }

    dataCritical() {
        let images = document.querySelectorAll('img[data-critical]');
        let revealImage = function(ele){
            Base.logger('Reveling Critical Image.');
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
        } else {
            Base.logger('Info: No Critical Images Found.');
        }
    };

    loadDeferredStyles() {
        let doc = this.doc,
            base = this;
        this.w.addEventListener('load', function() {
            let t = doc.getElementById("deferred-styles");
            if(t) {
                requestAnimationFrame(function () {
                    setTimeout(function () {
                        let e = document.createElement("div");
                        e.innerHTML = t.textContent, document.body.appendChild(e), t.parentElement.removeChild(t);
                        requestAnimationFrame(function () {
                            setTimeout(function () {
                                document.documentElement.className = document.documentElement.className.replace("css-loading", "css-loaded");
                                setTimeout(function() {
                                    Base.logger('Info: All styles loaded, wait and trigger load.');
                                    base.triggerLoad();
                                }, 400);
                            }, 0);
                        });
                    }, 0);
                });
            } else {
                Base.logger('Info: Deferred Styles not found, skipping to Base Load');
                base.triggerLoad();
            }
        });
    }

    triggerLoad() {
        this.doc.addEventListener('afterLoad', function() {
            Base.logger('Event: The base has been loaded!');
        });
        Base.triggerEvent('afterLoad');
    }

    init() {
        let base = this,
            w = window;

        w.lastPageYOffset = 0;
        w.bodyUpdate = false;
        if(this.config.web_components) {
            this.polyfillWebComponents();
        }
        w.addEventListener('scroll', this.bodyScroll, false);

        w.addEventListener('DOMContentLoaded', function() {
            base.loadDeferredStyles();
            base.dataCritical();
        });
    }
}

let base = new Base();