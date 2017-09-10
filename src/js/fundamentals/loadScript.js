/**
 * Created by Madila on 12/04/2017.
 */
(function(w) {
    var doc = document,
        html = doc.documentElement,
        fjs = doc.getElementsByTagName('script')[0];
    var loadScript = function(url, cb) {
        var js = doc.createElement('script');
        js.src = url;
        if(typeof cb == "function") {
            js.onload = cb;
        }
        fjs.parentNode.insertBefore(js, fjs);
    };
    w.loadScript = loadScript;
}( typeof global !== "undefined" ? global : this ));