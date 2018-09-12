/**
 * --------------------------------------------------------------------------
 * FontLoader (v0.0.2): fontLoader.js
 * Part of Mikado (https://github.com/OllieFordandCo/mikado/)
 * --------------------------------------------------------------------------
 */

class FontLoader {

    /**
     * ------------------------------------------------------------------------
     * Private FontLoader Helpers
     * ------------------------------------------------------------------------
     */
    constructor() {
        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.now = Date.now || function() {
                return new Date().getTime();
            };
        this.format = '';
        this.init();
    }

    // Source: https://github.com/filamentgroup/woff2-feature-test
    supportsWoff2() {
        if (!("FontFace" in window)) {
            return false;
        }

        let f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
        f.load()['catch'](function () {});
        return f.status === 'loading' || f.status === 'loaded';
    }

    loadFallback(font) {
        //Good old fashion @font-face declaration
        let newStyle = document.createElement('style');

        let fontUrl = font.href + this.format,
            fontName = font.dataset.name,
            fontWeight = ('weight' in font.dataset) ? font.dataset.weight : 'normal',
            fontStyle = ('style' in font.dataset) ? font.dataset.style : 'normal';

        let textNode = document.createTextNode(`
        @font-face {
            font-family: ${fontName};
            src: url('${fontUrl}') format('woff');
            font-weight:${fontWeight}";
            font-style:${fontStyle}";
        }
        `);
        newStyle.appendChild(textNode);

        document.head.appendChild(newStyle);
    }

    loadNativeFont(font) {
        let fontUrl = font.href + this.format,
            fontName = font.dataset.name,
            fontClass = fontName.replace(' ', '-'),
            fontWeight = ('weight' in font.dataset) ? font.dataset.weight : 'normal',
            fontStyle = ('style' in font.dataset) ? font.dataset.style : 'normal';

        console.log(fontUrl);

        let Font = new FontFace(fontName, "url(" + fontUrl + ")", {
            style: fontStyle,
            weight: fontWeight
        });

        Font.loaded.then(function (font) {
            document.documentElement.classList.add(fontClass + '-' + fontWeight + '-' + fontStyle + '-' + font.status);
        });
        document.fonts.add(Font);

    }

    loadDeferredFonts() {
        let doc = this.doc,
            fontloader = this;
        this.w.addEventListener('load', function() {
            let t = doc.getElementById("deferred-fonts");
            if(t) {
                requestAnimationFrame(function () {
                    setTimeout(function () {
                        let e = document.createElement("div");
                        e.innerHTML = t.textContent;
                        document.body.appendChild(e);
                        t.parentElement.removeChild(t);
                        requestAnimationFrame(function () {
                            setTimeout(function () {
                                document.documentElement.className = document.documentElement.className.replace("css-loading", "css-loaded");
                                setTimeout(function() {
                                    console.log('Info: All styles loaded, wait and trigger load.');
                                    fontloader.triggerLoad();
                                }, 400);
                            }, 0);
                        });
                    }, 0);
                });
            } else {
                console.log('Info: Deferred Fonts not found, skipping to Base Load');
                fontloader.triggerLoad();
            }
        });
    }

    triggerEvent(name) {
        let event = new CustomEvent(name);
        document.dispatchEvent(event);
        console.log(name);
        return false;
    }

    triggerLoad() {
        let self = this;
        this.doc.addEventListener('afterLoad', function() {
            console.log('Event: The base has been loaded!');
            self.init();
        });
        this.triggerEvent('afterLoad');
    }

    init() {
        let self = this, fonts = document.querySelectorAll('link[as="font"]');

        if(fonts.length === 0) {
            self.loadDeferredFonts();
            return;
        }

        let supportWoff2 = this.supportsWoff2();

        if("FontFace" in window) {
            console.log("Font Face API supported.");

            [].forEach.call(fonts, function (font) {
                if (!supportWoff2) {
                    font.href = font.href.substring(0, font.href.length - 1);
                }
                self.loadNativeFont(font);
                font.parentElement.removeChild(font);
            });

        } else {
            console.log("Font Face API not supported.");
            for (let i = 0; i < fonts.length; i++) {
                let font = fonts[i];
                console.log(supportWoff2);
                if (!supportWoff2) {
                    font.href = font.href.substring(0, font.href.length - 1);
                }
                this.loadFallback(font);
                font.parentElement.removeChild(font);
            }
        }

        // Add final class
        if("fonts" in document) {
            document.fonts.ready.then(function () {
                document.documentElement.classList.add('fonts-loaded');
            });
        } else {
            document.documentElement.classList.add('fonts-loaded');
        }
    }

}

new FontLoader();