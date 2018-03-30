class Scrolling {
    constructor() {
        this.isScrolling = false;
        this.elements = [];
        document.addEventListener('DOMContentLoaded', function() {
            scroller.init();
        });
    }

    doScrolling(e) {
        scroller.reveal();
        console.log('Scroller');
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
        if(scroller.elements.length > 0) {
            let elements = scroller.elements;
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                if (scroller.isPartiallyVisible(element)) {
                    element.classList.add("element-visible");
                } else {
                    element.classList.remove("element-visible");
                }
            }
        }
    }

    runScroll(e) {
        if (!scroller.isScrolling) {
            window.requestAnimationFrame(function () {
                scroller.doScrolling(e);
                scroller.isScrolling = false;
            });
        }
        scroller.isScrolling = true;
    }

    init() {
        this.elements = document.querySelectorAll('[data-reveal]');
        scroller.reveal();
        window.addEventListener("scroll", this.runScroll, false);
    }
}

window.scroller = new Scrolling();