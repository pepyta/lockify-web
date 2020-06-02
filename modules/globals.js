export let API_URL = "/api";

export let RECAPTCHA_SITE_KEY = "6Lfo9vwUAAAAAJYV2tIJjL_Isie-u_IcjSQlPYo_";

/*
https://stackoverflow.com/a/46181
*/
export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function getBrowser(){
    try {    
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if(isOpera) return "Opera";
    } catch {}
    try {
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if(isFirefox) return "Firefox";
    } catch {}
    try {
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        if(isSafari) return "Safari";
    } catch {}
    try {    
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if(isIE) return "Internet Explorer"; 
    } catch {}
    try {
        var isEdge = !isIE && !!window.StyleMedia;
        if(isEdge) return "Microsoft Edge";
    } catch {}
    try {
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if(isChrome) return "Google Chrome";
    } catch {}
    try {
        var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
        if(isEdgeChromium) return "New Microsoft Edge (Based on Chromium)";
    } catch {}
    return "Undetected browser";
}