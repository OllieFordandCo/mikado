// Get IE or Edge browser version
window.appbrowser = {};

var prefix = function () {
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
};


/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


var version = detectIE();

if (version === false) {
    window.appbrowser.name = false;
    window.appbrowser.version = false;
} else if (version >= 12) {
    window.appbrowser.name = 'Edge';
    window.appbrowser.version = version;
} else {
    window.appbrowser.name = 'IE';
    window.appbrowser.version = version;
}

window.appbrowser.prefix = prefix();

window.appbrowser.properties = {
    transform: ('transform' in document.createElement('div').style) ? 'transform' : window.appbrowser.prefix.lowercase + 'Transform'
};

var distance = 200,
    ticking = false;

function wheel(event) {
    if (event.wheelDelta) delta = event.wheelDelta / 120;
    else if (event.detail) delta = -event.detail / 3;

    handle();
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
}

function handle() {
    var doc = document.documentElement,
        top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    window.scroll({
        top: (top - (distance * delta)),
        left: 0,
        behavior: 'smooth'
    });
}

var ieScroll = function() {
    if(window.appbrowser.name && window.appbrowser.version) {
        if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
        window.onmousewheel = document.onmousewheel = wheel;

        window.addEventListener('keydown', function (e) {

            var doc = document.documentElement,
                top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

            switch (e.which) {
                //up
                case 38:
                    e.preventDefault();
                    window.scroll({
                        top: (top - (top - distance)),
                        left: 0,
                        behavior: 'smooth'
                    });
                    break;

                //down
                case 40:
                    e.preventDefault();
                    window.scroll({
                        top: (top - (top + distance)),
                        left: 0,
                        behavior: 'smooth'
                    });
                    break;
            }
        });
    }
};


function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        !(rect.bottom < 0 || rect.top > window.innerHeight)
    );
}

window.addEventListener('scroll', function(e) {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            [].slice.call(document.querySelectorAll('[data-visible]')).forEach(function (element) {
                element.dataset.visible = (isInViewport(element)) ? true : false;
            });
            ticking = false;
        });
    }
    ticking = true;
});

var parallax = function (element, _scrolled,  _threshold_element) {
    _threshold_element = (typeof _threshold_element == 'undefined') ? element.parentElement : document.querySelector(_threshold_element);

    var dataRatio = (element.dataset.ratio) ? element.dataset.ratio : 1;

    var hV=window.innerHeight;
    var hE=_threshold_element.clientHeight;
    var hB=element.clientHeight;
    var yE=_threshold_element.getBoundingClientRect().top; //Relative to view-port.
    var yB=((yE)/(hV))*(hE-hB);

    window.requestAnimationFrame(function () {
        element.style[window.appbrowser.properties.transform] = 'translateY(' + yB + 'px)';
    });

};

var initParallax = function() {
    [].slice.call(document.querySelectorAll('[data-parallax]')).forEach(function (element) {
        element.parentElement.dataset.visible = 'true';
        var doc = document.documentElement,
            top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        parallax(element, top);
    });
};

var doParallax = function() {
    [].slice.call(document.querySelectorAll('[data-parallax]')).forEach(function (element) {
        if(element.parentElement.dataset.visible) {
            var doc = document.documentElement,
                top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
            parallax(element, top);
        }
    });
};

window.addEventListener('scroll', doParallax);

window.addEventListener('load', initParallax);

ieScroll();