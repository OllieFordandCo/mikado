/**
 * --------------------------------------------------------------------------
 * FontLoader (v0.0.2): fontLoader.js
 * Part of Mikado (https://github.com/OllieFordandCo/mikado/)
 * --------------------------------------------------------------------------
 */

'use strict';

var FontLoader = (function () {

    /**
     * ------------------------------------------------------------------------
     * Private FontLoader Helpers
     * ------------------------------------------------------------------------
     */

    var fonts = [];
    var format = '';

    // Source: https://github.com/filamentgroup/woff2-feature-test
    function supportsWoff2() {
        if (!("FontFace" in window)) {
            return false;
        }

        var f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
        f.load()['catch'](function () {});
        return f.status == 'loading' || f.status == 'loaded';
    }

    function loadNativeFont(font) {

        var fontUrl = font.href + format;
        var fontName = font.getAttribute('name');
        var fontWeight = font.getAttribute('weight');

        var Font = new FontFace(fontName, "url(" + fontUrl + ")", {
            style: "normal",
            weight: fontWeight
        });

        Font.loaded.then(function (font) {
            document.documentElement.classList.add(fontName + '-' + fontWeight + '-' + font.status);
        });
        document.fonts.add(Font);
    }

    function init() {
        var fonts = document.querySelectorAll('link[as="font"]');

        console.log(fonts);
        var supportWoff2 = supportsWoff2();

        if ("FontFace" in window) {
            console.log("Font Face API supported.");
            fonts.forEach(function (font) {
                if(!supportWoff2) {
                    font.href = font.href.substring(0, font.href.length - 1);
                }
                loadNativeFont(font);
                font.parentElement.removeChild(font);
            });
        } else {
            console.log("Font Face API not supported.");
        }

        // Add final class
        if ("fonts" in document) {
            document.fonts.ready.then(function () {
                document.documentElement.classList.add('fonts-loaded');
            });
        } else {
            document.documentElement.classList.add('fonts-loaded');
        }
    }

    init();
    document.addEventListener('afterLoad', init);

    return FontLoader;

})(window);