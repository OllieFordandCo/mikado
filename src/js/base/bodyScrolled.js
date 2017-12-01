/**
 * Created by Madila on 27/04/2017.
 */
var w = window,
    doc = document;
w.addEventListener("load", function() {
    w.addEventListener("scroll", function () {
        if(w.pageYOffset > 0) {
            doc.documentElement.classList.add('scrolled');
        } else {
            doc.documentElement.classList.remove('scrolled');
        }
    });
});