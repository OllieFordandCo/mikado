if(typeof ampersand === 'undefined' || !('loadScript' in window)) {
    throw new Error('To Polyfill Ampersand\'s Javascript we require the ampersand variable and a Javascript loader declared. You will encounter multiple errors if you are using some javascript functions.');
}
var d = document, w = window;
('Promise' in w) || loadScript(ampersand.js_url+'promise.min.js'),
('scrollBehavior' in d.documentElement.style)  || loadScript(ampersand.js_url+'smoothscroll.min.js'),
('requestAnimationFrame' in w) || loadScript(ampersand.js_url+'raf.min.js'),
("function" == typeof CustomEvent) || loadScript(ampersand.js_url+'custom-event.min.js'),
("srcset" in d.createElement("img")) || loadScript(ampersand.js_url+'picturefill.min.js'),
('dataset' in d.createElement("div")) || loadScript(ampersand.js_url+'dataset.min.js'),
("classList" in d.createElement("div")) || loadScript(ampersand.js_url+'domtokenlist.min.js');