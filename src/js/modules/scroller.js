class Looper {

    constructor() {
        this.elements = [];
        this.lastPageYOffset = 0;
        this.ticking = false;

        window.looper = this;
        window.nextLoop = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                // IE Fallback, you can even fallback to onscroll
                function(callback){ window.setTimeout(callback, 1000/60) };
        document.addEventListener('DOMContentLoaded', function() {
            looper.init();
        });
    }

    doYScroll() {
        // All vertical
        this.reveal();
    }

    isPartiallyVisible(el) {
        let elementBoundary = el.getBoundingClientRect();

        let top = elementBoundary.top;
        let bottom = elementBoundary.bottom;
        let height = elementBoundary.height;

        return ((top + height >= 0) && (height + window.innerHeight >= bottom));
    }

    isFullyVisible(el) {
        let elementBoundary = el.getBoundingClientRect();

        let top = elementBoundary.top;
        let bottom = elementBoundary.bottom;

        return ((top >= 0) && (bottom <= window.innerHeight));
    }

    reveal(e) {
        if(looper.elements.length > 0) {
            let elements = looper.elements;
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i],
                    visibilityFunction = element.dataset.reveal == 'full' ? 'isFullyVisible' : 'isPartiallyVisible';

                if(looper[visibilityFunction](element)) {
                    element.classList.add("element-visible");
                } else {
                    element.classList.remove("element-visible");
                }
            }
        }
    }

    loop(){
        let currentScrollY = looper.lastPageYOffset;
        if(currentScrollY !== window.pageYOffset) {
            looper.doYScroll();
            nextLoop( looper.loop );
        } else {
            looper.ticking = false;
        }
    }



    runScroll(e) {
        console.log('scrolling');
        if(!looper.ticking) {
            looper.lastPageYOffset = window.pageYOffset;
            looper.loop();
        }
        looper.ticking = true;
    }

    init() {
        this.elements = document.querySelectorAll('[data-reveal]');
        window.addEventListener("scroll", this.runScroll, false);
        looper.doYScroll();
     }
}

new Looper();