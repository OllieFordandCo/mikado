/**
 * Created by Madila on 19/04/2017.
 */
var dataCritical = function() {
    var images = document.querySelectorAll('img[data-critical]');
    var revealImage = function(ele){
        ele = (ele instanceof HTMLImageElement) ? ele : ele.target;
        ele.removeAttribute('data-critical');
        ele.style.willChange = 'auto';
    };
    if(images) {
        [].slice.call(images).forEach(function (image) {
            if (image.complete) {
                revealImage(image);
            } else {
                delete image.style.opacity;
                image.style.willChange = 'opacity';
                image.style.transition = 'opacity 800ms linear';

                image.addEventListener('load', revealImage);
            }
        });
    }
};

docReady( function(){
    dataCritical();
    window.addEventListener('load', dataCritical);
});

