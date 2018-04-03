'use strict';
class Mikado {
    constructor() {
        this.w = window;
        this.doc = document;
        this.html = this.doc.documentElement;
        this.polyfillReady = false;
        this.systemReady = false;

        let prop;

        let mikadoConfigDefaults = {
            module_url: 'dist/js/mikado/modules/',
            vendor_url: 'dist/js/vendor/',
            dev: false
        };

        let mikadoConfig = window.mikadoConfig || {};

        for(prop in mikadoConfigDefaults){
            if(!(prop in mikadoConfig)){
                mikadoConfig[prop] = mikadoConfigDefaults[prop];
            }
        }

        this.config = mikadoConfig;

        let mikado = this;

        this.doc.addEventListener('polyfillReady', function() {
            mikado.polyfillReady = true;
        });

        this.doc.addEventListener('DOMContentLoaded', function () {
           Base.logger('Window Loaded: loading enhancers...');
           mikado.loadEnhancers();
        });

        this.doc.addEventListener('systemReady', function() {
            mikado.systemReady = true;
        });


    }

    // Load Conditionally (selector dependant) script, plus callback
    // If SystemJS is not ready we will ensure it will trigger when it is
    // The function will return either the import (which can be chained if your callback returns the value of the promise) or false if it was queued.
    // If you truly need to chain more than one callback, you should wrap this function on the systemReady event so you know you will get the promise.
    static loadConditionalImport(selector, plugin, cb) {
        if(document.querySelector(selector)) {
            if('System' in Window) {
                return System.import(plugin).then(cb);
            } else {
                document.addEventListener('systemReady', function() {
                    System.import(plugin).then(cb);
                });
                return false;
            }
        }
    }

    // Key needs to be both the id of the script, or the
    static loadConditionalGlobal(selector, key, plugin, cb, global = null) {
        cb = cb || function() {};
        if(document.querySelector(selector)) {
            let scriptSelector = 'script#'+key;
            if(document.querySelector(scriptSelector)) {
                if(global in window) {
                    cb.call();
                } else {
                    document.querySelector(scriptSelector).addEventListener('load', function() {
                       cb.call();
                    });
                }
            } else {
                Base.loadScript(plugin, cb, key);
            }
        }
    }

    moduleURL(module) {
        let config = window.mikadoConfig || {module_url: 'dist/js/vendor/'};
        return config.module_url+module;
    }

    loadSystemJs() {
        // Critical for more complex imports.
        Mikado.loadConditionalGlobal('body', 'System', this.moduleURL('system.min.js'), function() {
            let systemConfig = window.systemConfig || {};
            SystemJS.config(systemConfig);
            Base.triggerEvent('systemReady');
        });
    }

    // Example of necessary conditional dependencies before a conditional load
    loadLazySizes() {

        let triggerLoad = false;

        if(document.querySelector('[data-bg]')) {
            Mikado.loadConditionalGlobal('[data-bg]', 'unveilhooks', mikado.moduleURL('ls.unveilhooks.min.js'), function() {
                Base.triggerEvent('loadLazySizes');
            }, null);
            triggerLoad = false;
        } else {
            triggerLoad = true;
        }

        document.addEventListener('loadLazySizes', function() {
            window.lazySizesConfig = window.lazySizesConfig || {};
            let selector = ('lazyClass' in window.lazySizesConfig) ? window.lazySizesConfig.lazyClass : '.lazyload';
            Mikado.loadConditionalGlobal(selector, 'lazysizes', mikado.moduleURL('lazysizes.min.js'), function() {}, 'lazySizes');
        });

        if(triggerLoad) {
            Base.triggerEvent('loadLazySizes');
        }

    }

    loadEnhancers() {

        this.loadSystemJs();

        // Critical if forms are present.
        Mikado.loadConditionalGlobal('form', 'validate', this.moduleURL('validate.min.js'));

        this.loadLazySizes();

    }

}

let mikado = new Mikado();