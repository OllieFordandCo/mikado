if(typeof mikado === 'undefined' || !('loadScript' in window)) {
    //throw new Error('To Polyfill Mikado\'s Javascript we require the ampersand variable and a Javascript loader declared. You will encounter multiple errors if you are using some javascript functions.');
    console.log('Warning: To Polyfill Mikado\'s Javascript we require the ampersand variable and a Javascript loader declared through the function loadScript(script_url). We will try to supply defaults, but you will encounter multiple errors if you are using some javascript functions.')
    var mikado = {
        vendor_url: '/dist/js/'
    };
}
var d = document, w = window, img = document.createElement('img'), input = document.createElement('input'), div = d.createElement("div");
('Promise' in w) || loadScript(mikado.vendor_url+'promise.min.js'),
('scrollBehavior' in d.documentElement.style)  || loadScript(mikado.vendor_url+'smoothscroll.min.js'),
('requestAnimationFrame' in w) || loadScript(mikado.vendor_url+'raf.min.js'),
("function" == typeof CustomEvent) || loadScript(mikado.vendor_url+'custom-event.min.js'),
("srcset" in img) || loadScript(mikado.vendor_url+'picturefill.min.js'),
('dataset' in div) || loadScript(mikado.vendor_url+'dataset.min.js'),
("classList" in div) || loadScript(mikado.vendor_url+'domtokenlist.min.js'),
('validity' in input && 'badInput' in input.validity && 'patternMismatch' in input.validity && 'rangeOverflow' in input.validity && 'rangeUnderflow' in input.validity && 'stepMismatch' in input.validity && 'tooLong' in input.validity && 'tooShort' in input.validity && 'typeMismatch' in input.validity && 'valid' in input.validity && 'valueMissing' in input.validity) || loadScript(mikado.vendor_url+'domtokenlist.min.js');