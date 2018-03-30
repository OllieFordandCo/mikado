'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mikado = function () {
    function Mikado() {
        _classCallCheck(this, Mikado);

        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.vendorUrl = 'dist/js/vendor/';
        this.moduleUrl = 'dist/js/mikado/modules/';
        this.polyfillReady = false;
        this.dev = false;
        this.systemReady = false;

        var mikado = this;

        this.doc.addEventListener('polyfillReady', function () {
            mikado.polyfillReady = true;
        });

        this.doc.addEventListener('DOMContentLoaded', function () {
            Base.logger('Window Loaded: loading enhancers...');
            mikado.loadEnhancers();
        });

        this.doc.addEventListener('systemReady', function () {
            mikado.systemReady = true;
        });
    }

    // Load Conditionally (selector dependant) script, plus callback
    // If SystemJS is not ready we will ensure it will trigger when it is
    // The function will return either the import (which can be chained if your callback returns the value of the promise) or false if it was queued.
    // If you truly need to chain more than one callback, you should wrap this function on the systemReady event so you know you will get the promise.


    _createClass(Mikado, [{
        key: 'moduleURL',
        value: function moduleURL(module) {
            return this.moduleUrl + module;
        }
    }, {
        key: 'loadSystemJs',
        value: function loadSystemJs() {
            // Critical for more complex imports.
            Mikado.loadConditionalGlobal('body', 'System', this.moduleURL('system.min.js'), function () {
                systemConfig = systemConfig || {};
                SystemJS.config(systemConfig);
                Base.triggerEvent('systemReady');
            });
        }

        // Example of necessary conditional dependencies before a conditional load

    }, {
        key: 'loadLazySizes',
        value: function loadLazySizes() {

            var triggerLoad = false;

            if (document.querySelector('[data-bg]')) {
                Mikado.loadConditionalGlobal('[data-bg]', 'unveilhooks', mikado.moduleURL('ls.unveilhooks.min.js'), function () {
                    Base.triggerEvent('loadLazySizes');
                }, null);
                triggerLoad = false;
            } else {
                triggerLoad = true;
            }

            document.addEventListener('loadLazySizes', function () {
                Mikado.loadConditionalGlobal('.lazyload', 'lazysizes', mikado.moduleURL('lazysizes.min.js'), function () {}, 'lazySizes');
            });

            if (triggerLoad) {
                Base.triggerEvent('loadLazySizes');
            }
        }
    }, {
        key: 'loadEnhancers',
        value: function loadEnhancers() {

            this.loadSystemJs();

            // Critical if forms are present.
            Mikado.loadConditionalGlobal('form', 'validate', this.moduleURL('validate.min.js'));

            this.loadLazySizes();
        }
    }], [{
        key: 'loadConditionalImport',
        value: function loadConditionalImport(selector, plugin, cb) {
            if (document.querySelector(selector)) {
                if ('System' in Window) {
                    return System.import(plugin).then(cb);
                } else {
                    document.addEventListener('systemReady', function () {
                        System.import(plugin).then(cb);
                    });
                    return false;
                }
            }
        }

        // Key needs to be both the id of the script, or the

    }, {
        key: 'loadConditionalGlobal',
        value: function loadConditionalGlobal(selector, key, plugin, cb) {
            var global = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            cb = cb || function () {};
            if (document.querySelector(selector)) {
                var scriptSelector = 'script#' + key;
                if (document.querySelector(scriptSelector)) {
                    if (global in window) {
                        cb.call();
                    } else {
                        document.querySelector(scriptSelector).addEventListener('load', function () {
                            cb.call();
                        });
                    }
                } else {
                    Base.loadScript(plugin, cb, key);
                }
            }
        }
    }]);

    return Mikado;
}();

window.mikado = new Mikado();