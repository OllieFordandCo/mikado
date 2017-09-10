/**
 * Created by Madila on 20/04/2017.
 */
window.addEventListener("load", function(event) {
    var elementList = document.querySelectorAll('.animateonload');
    forEach(elementList, function (index, value) {
        elementList[index].classList.remove('paused');
    });
});