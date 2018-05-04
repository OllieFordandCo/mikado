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

        for (prop in mikadoConfigDefaults) {
            if (!(prop in mikadoConfig)) {
                mikadoConfig[prop] = mikadoConfigDefaults[prop];
            }
        }

        this.config = mikadoConfig;

        let mikado = this;

        this.doc.addEventListener('polyfillReady', function () {
            mikado.polyfillReady = true;
        });

        this.doc.addEventListener('DOMContentLoaded', function () {
            Base.logger('Window Loaded: loading enhancers...');
            mikado.initMenuToggle();
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
    static loadConditionalImport(selector, plugin, cb) {
        if (document.querySelector(selector)) {
            if ('System' in window) {
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
    static loadConditionalGlobal(selector, key, plugin, cb, global = null) {
        cb = cb || function () {
            };
        if (document.querySelector(selector)) {
            let scriptSelector = 'script#' + key;
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

    toggle(e) {
        e.preventDefault();
        e.stopPropagation();
        // If no target present, it will toggle itself, clever git!
        var targets = ('togglerTarget' in this.dataset) ? document.querySelectorAll(this.dataset.togglerTarget) : [this];

        var classPrefix = (this.dataset.toggler) ? this.dataset.toggler : 'toggler-toggl';

        // If it has the class and the datatset classPrefix, dont untoggle
        if('classPrefix' in this.dataset && this.className.indexOf(this.dataset.classPrefix) > -1) {
            return;
        }

        Base.forEach(targets, function(index, target) {
            if (target && target.className.indexOf(classPrefix+'ed') > -1) {
                target.classList.add(classPrefix+'ing');
                target.classList.remove(classPrefix+'ed');
                setTimeout(function () {
                    target.classList.remove(classPrefix+'ing');
                }, 300);
                console.log('untoggled');
            } else if (target) {
                target.classList.add(classPrefix+'ed');
                console.log('toggled');
            }
        });

    }


    unToggle(e) {
        e.stopPropagation();
        var classPrefix = this.dataset.classPrefix;

        if(e.target.className.indexOf(classPrefix) > -1) {
            return false;
        }
        // || Base.findAncestor(targetNode, classPrefix+'ed')

        var toggleClass = classPrefix+'ed',
            targets  = document.querySelectorAll('.'+toggleClass),
            targetNode = e.target;

        console.log('untoggled');

        Base.forEach(targets, function(index, target) {
            target.classList.add(classPrefix+'ing');
            target.classList.remove(classPrefix+'ed');
            setTimeout(function () {
                target.classList.remove(classPrefix+'ing');
            }, 300);
        });
    }

    initMenuToggle() {
        var togglers = document.querySelectorAll('[data-toggler]'),
            mikado = this;

        Base.forEach(togglers, function(index, toggler) {

            // Allow for the class prefix to be override, it will add an ed and ing to whatever is set.
            var classPrefix = (toggler.dataset.toggler) ? toggler.dataset.toggler : 'toggler-toggl';

            // Get all dismissable elements
            var dismissables = ('togglerDismiss' in toggler.dataset) ? document.querySelectorAll(toggler.dataset.togglerDismiss) : false;

            // If there are dismissable elements, bind the event
            if(dismissables) {

                    Base.forEach(dismissables, function (index, dismiss) {
                        if (dismiss == toggler) {
                            return;
                        }
                        dismiss.dataset.classPrefix = classPrefix;
                        dismiss.addEventListener('click', mikado.unToggle);
                    });

            }

            // We know there is definetly a toggler, so bind the event
            toggler.addEventListener('click', mikado.toggle);

        });
    }

    moduleURL(module) {
        let config = window.mikadoConfig || {module_url: 'dist/js/mikado/modules/'};
        return config.module_url + module;
    }

    loadSystemJs() {
        // Critical for more complex imports.
        Mikado.loadConditionalGlobal('body', 'System', this.moduleURL('system.min.js'), function () {
            let systemConfig = window.systemConfig || {};
            SystemJS.config(systemConfig);
            Base.triggerEvent('systemReady');
        });
    }

    // Example of necessary conditional dependencies before a conditional load
    loadLazySizes() {

        let triggerLoad = false;

        if (document.querySelector('[data-bg]')) {
            Mikado.loadConditionalGlobal('[data-bg]', 'unveilhooks', mikado.moduleURL('ls.unveilhooks.min.js'), function () {
                Base.triggerEvent('loadLazySizes');
            }, null);
            triggerLoad = false;
        } else {
            triggerLoad = true;
        }

        document.addEventListener('loadLazySizes', function () {
            window.lazySizesConfig = window.lazySizesConfig || {};
            let selector = ('lazyClass' in window.lazySizesConfig) ? window.lazySizesConfig.lazyClass : '.lazyload';
            Mikado.loadConditionalGlobal(selector, 'lazysizes', mikado.moduleURL('lazysizes.min.js'), function () {
            }, 'lazySizes');
        });

        if (triggerLoad) {
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