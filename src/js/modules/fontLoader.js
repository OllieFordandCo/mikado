/**
 * --------------------------------------------------------------------------
 * FontLoader (v0.0.2): fontLoader.js
 * Part of Mikado (https://github.com/OllieFordandCo/mikado/)
 * --------------------------------------------------------------------------
 */

export const FontLoader = (() => {

    /**
     * ------------------------------------------------------------------------
     * Private TransitionEnd Helpers
     * ------------------------------------------------------------------------
     */

    let fonts = []
    let loSto
    let supportsWoff2 = supportsWoff2Check();

    try {
        // We set up a proxy variable to help with localStorage, e.g. when cookies are disabled
        // and the browser prevents us accessing it.
        // Otherwise some exceptions can be thrown which completely prevent font loading.
        loSto = localStorage || {};
    } catch(ex) {
        loSto = {};
    }

    // Source: https://github.com/filamentgroup/woff2-feature-test
    function supportsWoff2Check() {
        if( !( "FontFace" in window ) ) {
            return false;
        }

        var f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
        f.load()['catch'](function () {
        });
        return f.status == 'loading' || f.status == 'loaded';
    }


    function loadNativeFont(fontName, fontUrl, options) {

        var loStoPrefix = 'x-font-' + fontName + '-' + options[2],
            storedFont = (typeof loSto[loStoPrefix] !== "undefined") ? loSto[loStoPrefix].trim() : loSto[loStoPrefix];

        var isStored = (storedFont == fontUrl.trim());

        var asset = (isStored) ? 'url( "data:application/font-woff2;base64,'+loSto[loStoPrefix + '-data']+'" ) format( "woff2" )' : "url("+fontUrl+")";

        if(!isStored) {
            var request = new XMLHttpRequest();
            request.overrideMimeType("text/plain; charset=x-user-defined");
            request.open('GET', fontUrl);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400 && typeof request.responseText != "undefined") {
                    loSto[loStoPrefix + '-data'] = base64Encode(request.responseText);
                } else {
                    asset = "url("+fontUrl+")";
                }
            };
            request.send(null);
        }

        var Font = new FontFace(fontName, asset, {
            style: "normal",
            weight:options[2]
        });

        // Check if font is on the storage
        if (isStored) {
            document.documentElement.classList.add(fontName+'-'+options[2]+'-loaded');
        } else {
            Font.loaded.then(function(font) {
                document.documentElement.classList.add(fontName+'-'+font.weight+'-'+font.status);
            });
        }

        document.fonts.add(Font);

    }

    function loadCssFont() {
        var fallbackCss = document.querySelector('meta[name="font-face-stylesheet"]');

        if(fallbackCss) {
            loadCSS(fallbackCss.content);
        }

        loadScript(ampersand.assets_url+'/js/fontfaceobserver.standalone.js', function() {

            fonts.forEach(function(meta) {
                var options = meta.split(':');
                var font =  new FontFaceObserver(options[0],{
                    style: "normal",
                    weight:options[2]
                });
                font.load().then(function (font) {
                    loSto['fontsLoaded'] = true;
                    document.documentElement.classList.add(fontName+'-'+options[2]+'-loaded');
                }).catch(function () {
                    loSto['fontsLoaded'] = false;
                });
            });

        });
    }

    function base64Encode(str) {
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = str.length, c1, c2, c3;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += CHARS.charAt(c3 & 0x3F);
        }
        return out;
    }

    /**
     * --------------------------------------------------------------------------
     * Public FontLoader Api
     * --------------------------------------------------------------------------
     */

    const FontLoader = {

        init() {
            var metaFontFace = document.querySelector('meta[name="font-face"]');
            fonts = metaFontFace ? metaFontFace.content.split('|') : [];

            if (loSto['fontsLoaded']) {
                document.documentElement.classList.add('fonts-loaded');
            }

            if("FontFace" in window) {
                console.log("Font Face API supported.");
                var format =  supportsWoff2() ? '.woff2' : '.woff';
                fonts.forEach(function(meta) {
                    var options = meta.split(':'),
                        url = options[1]+format;
                    loadNativeFont(options[0], url, options);
                });
            } else {
                console.log("Font Face API not supported.");
                loadCssFont();
            }

            // Add final class
            if("fonts" in document) {
                document.fonts.ready.then(function () {
                    loSto['fontsLoaded'] = true;
                    document.documentElement.classList.add('fonts-loaded');
                });
            } else {
                document.documentElement.classList.add('fonts-loaded');
            }
        }
    }

    FontLoader.init()

    return FontLoader

})(window)