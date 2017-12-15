'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function () {
    function Base() {
        _classCallCheck(this, Base);

        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.vendor_url = 'dist/js/vendor/';
        this.polyfills = [];
        this.polyfillsCount = 0;

        var base = this;
        this.docReady(function () {
            base.setPolyfills();
            base.bodyScrolled();
            base.loadDeferredStyles();
            base.dataCritical(true);
        });
    }

    _createClass(Base, [{
        key: 'docReady',
        value: function docReady(cb) {
            var base = this;
            if (document.body) {
                console.log('Info: Document is ready.');
                return cb();
            }
            setTimeout(function () {
                base.docReady(cb);
            });
        }
    }, {
        key: 'loadCSS',
        value: function loadCSS(href, before, media) {
            var doc = this.doc;
            var ss = doc.createElement("link");
            var ref;
            if (before) {
                ref = before;
            } else {
                var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
                ref = refs[refs.length - 1];
            }

            var sheets = doc.styleSheets;
            ss.rel = "stylesheet";
            ss.href = href;
            // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
            ss.media = "only x";

            // Inject link
            // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
            // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
            this.docReady(function () {
                ref.parentNode.insertBefore(ss, before ? ref : ref.nextSibling);
            });
            // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
            var onloadcssdefined = function onloadcssdefined(cb) {
                var resolvedHref = ss.href;
                var i = sheets.length;
                while (i--) {
                    if (sheets[i].href === resolvedHref) {
                        return cb();
                    }
                }
                setTimeout(function () {
                    onloadcssdefined(cb);
                });
            };

            function loadCB() {
                if (ss.addEventListener) {
                    ss.removeEventListener("load", loadCB);
                }
                ss.media = media || "all";
            }

            // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
            if (ss.addEventListener) {
                ss.addEventListener("load", loadCB);
            }
            ss.onloadcssdefined = onloadcssdefined;
            onloadcssdefined(loadCB);
            return ss;
        }
    }, {
        key: 'loadScript',
        value: function loadScript(url, cb, id) {
            var fjs = this.doc.getElementsByTagName('script')[0];
            var js = this.doc.createElement('script');
            js.src = url;
            if (id) {
                js.id = id;
            }
            if (typeof cb == "function") {
                js.onload = cb;
            }
            fjs.parentNode.insertBefore(js, fjs);
        }
    }, {
        key: 'addPolyfill',
        value: function addPolyfill(url) {
            this.polyfills.push(url);
            this.polyfillsCount++;
        }
    }, {
        key: 'setPolyfills',
        value: function setPolyfills() {
            var base = this,
                d = base.doc,
                w = base.w,
                img = document.createElement('img'),
                input = document.createElement('input'),
                div = d.createElement("div");
            'Promise' in w || base.addPolyfill('//cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js'), 'scrollBehavior' in d.documentElement.style || base.addPolyfill(base.vendor_url + 'smoothscroll.min.js'), 'requestAnimationFrame' in w || base.addPolyfill(base.vendor_url + 'raf.min.js'), "function" == typeof CustomEvent || base.addPolyfill(base.vendor_url + 'custom-event.min.js'), "srcset" in img || base.addPolyfill(base.vendor_url + 'picturefill.min.js'), 'dataset' in div || base.addPolyfill(base.vendor_url + 'dataset.min.js'), "classList" in div || base.addPolyfill(base.vendor_url + 'domtokenlist.min.js'), 'validity' in input && 'badInput' in input.validity && 'patternMismatch' in input.validity && 'rangeOverflow' in input.validity && 'rangeUnderflow' in input.validity && 'stepMismatch' in input.validity && 'tooLong' in input.validity && 'tooShort' in input.validity && 'typeMismatch' in input.validity && 'valid' in input.validity && 'valueMissing' in input.validity || base.addPolyfill(base.vendor_url + 'domtokenlist.min.js');

            console.log(base.polyfills, base.polyfillsCount);

            if (base.polyfills.length > 0) {
                base.polyfills.forEach(function (url) {
                    base.loadScript(url, function () {
                        base.polyfillsCount--;
                        if (base.polyfillsCount == 0) {
                            Base.triggerEvent('polyfillReady');
                        }
                    });
                });
            } else {
                Base.triggerEvent('polyfillReady');
            }
        }
    }, {
        key: 'bodyScrolled',
        value: function bodyScrolled() {
            var doc = this.doc;
            this.w.addEventListener("scroll", function () {
                if (this.pageYOffset > 0) {
                    doc.documentElement.classList.add('scrolled');
                } else {
                    doc.documentElement.classList.remove('scrolled');
                }
            });
        }
    }, {
        key: 'dataCritical',
        value: function dataCritical(init) {
            var images = document.querySelectorAll('img[data-critical]');
            var revealImage = function revealImage(ele) {
                console.log('Reveling Critical Image.');
                ele = ele instanceof HTMLImageElement ? ele : ele.target;
                ele.removeAttribute('data-critical');
                ele.style.willChange = 'auto';
            };
            if (images.length > 0) {
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
        }
    }, {
        key: 'loadDeferredStyles',
        value: function loadDeferredStyles() {
            var doc = this.doc,
                base = this;
            this.w.addEventListener('load', function () {
                var t = doc.getElementById("deferred-styles");
                if (t) {
                    window.requestAnimationFrame(function () {
                        window.setTimeout(function () {
                            var e = document.createElement("div");
                            e.innerHTML = t.textContent, document.body.appendChild(e), t.parentElement.removeChild(t);
                            window.requestAnimationFrame(function () {
                                window.setTimeout(function () {
                                    document.documentElement.className = document.documentElement.className.replace("css-loading", "css-loaded");
                                    setTimeout(function () {
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
    }, {
        key: 'triggerLoad',
        value: function triggerLoad() {
            this.doc.addEventListener('afterLoad', function () {
                console.log('Event: The base has been loaded!');
            });
            Base.triggerEvent('afterLoad');
        }
    }], [{
        key: 'triggerEvent',
        value: function triggerEvent(name) {
            var event = new CustomEvent(name);
            document.dispatchEvent(event);
            console.log(name);
        }
    }]);

    return Base;
}();

var base = new Base();