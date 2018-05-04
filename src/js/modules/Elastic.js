class Elastic {

    constructor() {
        this.elements = [];
        this.vendor = '';
        this.properties = {
            /**
             * Generates CSS3's translate3d transformation style for Opera, Chrome/Safari, Firefox and IE
             *
             * @method translate3d
             * @param {Number} x The X axis coordinate
             * @param {Number} y The Y axis coordinate
             * @param {Number} z The Z axis coordinate
             * @return {String} The css style code
             */
            translate3d : function(x, y, z) {
                var tr = this.vendor + 'transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px);'+ this.vendor + 'transition: 0ms;' +
                    'transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); transition: 0ms;';

                return tr;
            },

            /**
             * Generates CSS3's scale3d transformation style for Opera, Chrome/Safari, Firefox and IE
             * The scaling is symetric, with the same value for width and height
             *
             * @method scale3d
             * @param {Number} s The scale
             * @param {Number} t The transition time / animation duration, defaults to 0
             * @return {String} The css style code
             */
            scale3d : function(s, t) {
                var tr = '-webkit-transform: scale3d(' + s + ', ' + s + ', 1); -webkit-transition: 0ms;' +
                    '-moz-transform: scale3d(' + s + ', ' + s + ', 1); -moz-transition: 0ms;' +
                    '-ms-transform: scale3d(' + s + ', ' + s + ', 1); -ms-transition: 0ms;' +
                    '-o-transform: scale(' + s + '); -o-transition: 0ms;' +
                    'transform: scale3d(' + s + ', ' + s + ', 1); transition: 0ms;';

                return tr
            },

            /**
             * Used to move a scaled element using translate, while keeping the scale
             * Generates the required CSS3 style for Opera, Chrome/Safari, Firefox and IE
             *
             * @method zoomTo
             * @param {Number} x The X axis coordinate of the transformation
             * @param {Number} y The Y axis coordinate of the transformation
             * @param {Number} s The scale of the element (symetric, with the same value for width and height)
             * @param {Number} t The transition time / animation duration, defaults to 0
             * @return The css style code
             */
            zoomTo : function(x, y, s, t) {
                s = (typeof s === "undefined") ? 2 : s; //defaults to 2

                var tr = '-webkit-transform: translate3d(' + x + 'px, ' + y + 'px, 0px) scale3d(' + s + ', ' + s + ', 1);' +
                    '-moz-transform: translate3d(' + x + 'px, ' + y + 'px, 0px) scale3d(' + s + ', ' + s + ', 1);' +
                    '-ms-transform: translate3d(' + x + 'px, ' + y + 'px, 0px) scale3d(' + s + ', ' + s + ', 1);' +
                    '-o-transform: translate(' + x + 'px, ' + y + 'px) scale(' + s + ');' +
                    'transform: translate3d(' + x + 'px, ' + y + 'px, 0px) scale3d(' + s + ', ' + s + ', 1);';

                return tr;
            }
        };
        this.easing = {
            // no easing, no acceleration
            linear: function (t) { return t },
            // accelerating from zero velocity
            easeInQuad: function (t) { return t*t },
            // decelerating to zero velocity
            easeOutQuad: function (t) { return t*(2-t) },
            // acceleration until halfway, then deceleration
            easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
            // accelerating from zero velocity
            easeInCubic: function (t) { return t*t*t },
            // decelerating to zero velocity
            easeOutCubic: function (t) { return (--t)*t*t+1 },
            // acceleration until halfway, then deceleration
            easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
            // accelerating from zero velocity
            easeInQuart: function (t) { return t*t*t*t },
            // decelerating to zero velocity
            easeOutQuart: function (t) { return 1-(--t)*t*t*t },
            // acceleration until halfway, then deceleration
            easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
            // accelerating from zero velocity
            easeInQuint: function (t) { return t*t*t*t*t },
            // decelerating to zero velocity
            easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
            // acceleration until halfway, then deceleration
            easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
        };
        this.init();
    }

    static dataSetToArray(string) {
        return JSON.parse("[" + string + "]");
    }

    prefix() {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1],
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre[0].toUpperCase() + pre.substr(1)
        };
    }

    elementInit() {
        if("willChange" in elastic.elements[0].style) {
            Base.forEach(elastic.elements, function(index, item) {
                item.style.willChange = ('elasticProperty' in item.dataset) ? item.dataset.elasticProperty : 'opacity';
            });
        }
    }

    animate(y) {
        if(elastic.elements.length > 0) {
            Base.forEach(elastic.elements, function(index, item) {
                var property = ('elasticProperty' in item.dataset) ? item.dataset.elasticProperty : 'opacity';

                // Leave early if the property is not supported or set
                if(!property in item.style) {
                    return;
                }

                var fromTo = ('elasticFromTo' in item.dataset) ? Elastic.dataSetToArray(item.dataset.elasticFromTo) : [0,0];
                var values = ('elasticValues' in item.dataset) ? Elastic.dataSetToArray(item.dataset.elasticValues) : [0,0];
                //var boundingRect = item.getBoundingClientRect();

                if(property in this.css) {
                    property = this.css[property]();
                }

                if(fromTo[0] > y) {
                    item.style[property] = values[0]+'%';
                    return;
                }

                if(fromTo[1] < y) {
                    item.style[property] = values[1]+'%';
                    return;
                }


                console.log(y);
                var percentage = y * 100 / fromTo[1];
                var propertyValue = percentage * 100 / values[1];
                item.style[property] = propertyValue+'%';

            });
        }
        elastic.elements = document.querySelectorAll('[data-elastic]');
    }

    init() {
        window.addEventListener("load", function() {
            elastic.elements = document.querySelectorAll('[data-elastic]');
            Base.logger('Elastic is active');
            if(elastic.elements.length > 0) {
                this.vendor = this.prefix().css;
                elastic.elementInit();
                elastic.animate();
                window.onscrolling(elastic.animate);
            }
        }, false);
    }
}

window.elastic = new Elastic();