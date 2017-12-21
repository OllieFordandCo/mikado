'use strict';
class Mikado {
    constructor() {
        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.vendorUrl = 'dist/js/vendor/';
        this.moduleUrl = 'dist/js/mikado/modules/';
        this.polyfillReady = false;
        this.systemReady = false;

        var mikado = this;

        this.doc.addEventListener('polyfillReady', function() {
            this.polyfillReady = true;
            mikado.loadEnhancers();
        });

        this.doc.addEventListener('systemReady', function() {
            this.systemReady = false;
        });
    }

    static loadConditionalImport(selector, plugin, cb) {
        if(document.querySelector(selector)) {
            if('System' in Window) {
                System.import(plugin).then(cb);
            } else {
                document.addEventListener('systemReady', function() {
                    System.import(plugin).then(cb);
                });
            }
        }
    }

    static loadConditionalGlobal(selector, key, plugin, cb) {
        cb = cb || function() {};
        if(document.querySelector(selector)) {
            var scriptSelector = 'script[id="'+key+'"]';
            if(document.querySelector(scriptSelector)) {
                if(window[key]) {
                    cb.call();
                } else {
                    document.querySelector(scriptSelector).addEventListener('load', function() {
                       cb.call();
                    });
                }
            } else {
                base.loadScript(plugin, cb, key);
            }
        }
    }

    moduleURL(module) {
        return this.moduleUrl+module;
    }

    loadEnhancers() {

        Mikado.loadConditionalGlobal('body', 'System', this.moduleURL('system.min.js'), function() {
            systemConfig = systemConfig || {};
            SystemJS.config(systemConfig);
            Base.triggerEvent('systemReady');
        });

        Mikado.loadConditionalGlobal('form', 'validate', this.moduleURL('validate.min.js'));

    }

}

const mikado = new Mikado();