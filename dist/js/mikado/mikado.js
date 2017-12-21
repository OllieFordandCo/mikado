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
        this.systemReady = false;

        var mikado = this;

        this.doc.addEventListener('polyfillReady', function () {
            this.polyfillReady = true;
            mikado.loadEnhancers();
        });

        this.doc.addEventListener('systemReady', function () {
            this.systemReady = false;
        });
    }

    _createClass(Mikado, [{
        key: 'moduleURL',
        value: function moduleURL(module) {
            return this.moduleUrl + module;
        }
    }, {
        key: 'loadEnhancers',
        value: function loadEnhancers() {

            Mikado.loadConditionalGlobal('body', 'System', this.moduleURL('system.min.js'), function () {
                systemConfig = systemConfig || {};
                SystemJS.config(systemConfig);
                Base.triggerEvent('systemReady');
            });

            Mikado.loadConditionalGlobal('form', 'validate', this.moduleURL('validate.min.js'));
        }
    }], [{
        key: 'loadConditionalImport',
        value: function loadConditionalImport(selector, plugin, cb) {
            if (document.querySelector(selector)) {
                if ('System' in Window) {
                    System.import(plugin).then(cb);
                } else {
                    document.addEventListener('systemReady', function () {
                        System.import(plugin).then(cb);
                    });
                }
            }
        }
    }, {
        key: 'loadConditionalGlobal',
        value: function loadConditionalGlobal(selector, key, plugin, cb) {
            cb = cb || function () {};
            if (document.querySelector(selector)) {
                var scriptSelector = 'script[id="' + key + '"]';
                if (document.querySelector(scriptSelector)) {
                    if (window[key]) {
                        cb.call();
                    } else {
                        document.querySelector(scriptSelector).addEventListener('load', function () {
                            cb.call();
                        });
                    }
                } else {
                    base.loadScript(plugin, cb, key);
                }
            }
        }
    }]);

    return Mikado;
}();

var mikado = new Mikado();