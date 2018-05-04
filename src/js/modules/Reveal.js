class Reveal {

    constructor() {
        this.elements = [];
        this.init();
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

    reveal(position) {


        if(reveal.elements.length > 0) {
            Base.forEach(reveal.elements, function(index, item) {
                let visibilityFunction = (item.dataset.reveal === 'full') ? 'isFullyVisible' : 'isPartiallyVisible';

                if (reveal[visibilityFunction](item)) {
                    item.classList.add("element-visible");
                    if('revealOnce' in item.dataset) {
                        item.removeAttribute('data-reveal');
                    }
                } else {
                    item.classList.remove("element-visible");
                }
            });
        }
        reveal.elements = document.querySelectorAll('[data-reveal]');
    }

    init() {
        window.addEventListener("load", function() {
            reveal.elements = document.querySelectorAll('[data-reveal]');
            Base.logger('Reveal is active');
            reveal.reveal();
            window.onscrolling(function() {
                reveal.reveal();
            });
        }, false);
     }
}

window.reveal = new Reveal();