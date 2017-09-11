window.addEventListener('load', function() {
    var t = document.getElementById("deferred-styles");
    console.log(t);
    if(t) {
        window.requestAnimationFrame(function () {
            window.setTimeout(function () {
                var e = document.createElement("div");
                e.innerHTML = t.textContent, document.body.appendChild(e), t.parentElement.removeChild(t);
                window.requestAnimationFrame(function () {
                    window.setTimeout(function () {
                        document.documentElement.className = document.documentElement.className.replace("css-loading", "css-loaded");
                        setTimeout(function() {
                            document.dispatchEvent(new CustomEvent('afterLoad', true));
                        }, 400);
                    }, 0);
                });
            }, 0);
        });
    }
});