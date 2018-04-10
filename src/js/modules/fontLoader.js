/**
 * --------------------------------------------------------------------------
 * FontLoader (v0.0.2): fontLoader.js
 * Part of Mikado (https://github.com/OllieFordandCo/mikado/)
 * --------------------------------------------------------------------------
 */

'use strict';

let FontLoader = function () {

    /**
     * ------------------------------------------------------------------------
     * Private FontLoader Helpers
     * ------------------------------------------------------------------------
     */

    let fonts = [];
    let format = '';

    // Source: https://github.com/filamentgroup/woff2-feature-test
    function supportsWoff2() {
        if (!("FontFace" in window)) {
            return false;
        }

        let f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
        f.load()['catch'](function () {});
        return f.status === 'loading' || f.status === 'loaded';
    }

    function loadFallback(font) {
        //Good old fashion @font-face declaration
        let newStyle = document.createElement('style');
        let fontUrl = font.href + format;
        let fontName = font.getAttribute('name');
        let fontStyle = ('style' in font.dataset) ? font.dataset.style : 'normal';
        let fontWeight = ('weight' in font.dataset) ? font.dataset.weight : 'normal';
        let textNode = document.createTextNode("\
        @font-face {\
            font-family: " + fontName + ";\
            src: url('" + fontUrl + "') format('woff');\
            font-weight: " + fontWeight + ";\
            font-style: " + fontStyle + ";\
        }\
        ");
        console.log(textNode);
        newStyle.appendChild(textNode);

        document.head.appendChild(newStyle);
    }

    function loadNativeFont(font) {

        let fontUrl = font.href + format,
            fontName = font.getAttribute('name'),
            fontClass = fontName.replace(' ', '-'),
            fontWeight = ('weight' in font.dataset) ? font.dataset.weight : 'normal',
            fontStyle = ('style' in font.dataset) ? font.dataset.style : 'normal';

        let Font = new FontFace(fontName, "url(" + fontUrl + ")", {
            style: fontStyle,
            weight: fontWeight
        });

        Font.loaded.then(function (font) {
            document.documentElement.classList.add(fontClass + '-' + fontWeight + '-' + fontStyle + '-' + font.status);
        });
        document.fonts.add(Font);

    }

    function init() {
        let fonts = document.querySelectorAll('link[as="font"]');

        Base.logger(fonts);

        let supportWoff2 = supportsWoff2();

        if("FontFace" in window) {
            Base.logger("Font Face API supported.");

            [].forEach.call(fonts, function (font) {
                if (!supportWoff2) {
                    font.href = font.href.substring(0, font.href.length - 1);
                }
                loadNativeFont(font);
                font.parentElement.removeChild(font);
            });

        } else {
            Base.logger("Font Face API not supported.");
            for (let i = 0; i < fonts.length; i++) {
                let font = fonts[i];
                console.log(supportWoff2);
                if (!supportWoff2) {
                    font.href = font.href.substring(0, font.href.length - 1);
                }
                loadFallback(font);
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

    init();
    document.addEventListener('afterLoad', init);

    return this;
}(window);