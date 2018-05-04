class timeClock extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
        this.date = new Date().toLocaleString()

    }

    render () {
        console.log(this.date);
        this.textContent = this.date;
    }

    connectedCallback() {
        console.log('Time Clock element added to page.')
        this.render()
    }

}

customElements.define('time-clock', timeClock);