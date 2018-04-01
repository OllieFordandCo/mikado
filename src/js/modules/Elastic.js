class Elastic {

    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        window.addEventListener("load", function() {
            elastic.elements = document.querySelectorAll('[data-elastic]');
        }, false);
    }
}

window.elastic = new Elastic();