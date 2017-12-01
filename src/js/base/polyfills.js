if(typeof mikado === 'undefined' || !('loadScript' in window)) {
    //throw new Error('To Polyfill Mikado\'s Javascript we require the ampersand variable and a Javascript loader declared. You will encounter multiple errors if you are using some javascript functions.');
    console.log('Warning: To Polyfill Mikado\'s Javascript we require the ampersand variable and a Javascript loader declared through the function loadScript(script_url). We will try to supply defaults, but you will encounter multiple errors if you are using some javascript functions.')
    var mikado = {
        vendor_url: '/dist/js/'
    };
}
var d = document, w = window;
('Promise' in w) || loadScript(mikado.vendor_url+'promise.min.js'),
('scrollBehavior' in d.documentElement.style)  || loadScript(mikado.vendor_url+'smoothscroll.min.js'),
('requestAnimationFrame' in w) || loadScript(mikado.vendor_url+'raf.min.js'),
("function" == typeof CustomEvent) || loadScript(mikado.vendor_url+'custom-event.min.js'),
("srcset" in d.createElement("img")) || loadScript(mikado.vendor_url+'picturefill.min.js'),
('dataset' in d.createElement("div")) || loadScript(mikado.vendor_url+'dataset.min.js'),
("classList" in d.createElement("div")) || loadScript(mikado.vendor_url+'domtokenlist.min.js');