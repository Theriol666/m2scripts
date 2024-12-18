(function () {
    'use strict';

    let appInitretry = 1,
    appInitmaxRetry = 5,
    appInitTimeoutInterval = 2000;

    function ensureScriptExists(url) {
        const scripts = document.getElementsByTagName('script');
        
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === url) {
                return;
            }
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        
        document.head.appendChild(script);
    }

    function initM2Script(Class){
        if (typeof Class === "undefined" && appInitretry <= appInitmaxRetry) {
            setTimeout(function() { initM2Script(Class) }, appInitTimeoutInterval);
            appInitretry++;
        } else if(typeof Class !== "undefined") {
            // load the class and assign the class name to the window context
            let initClass = new Class();
                className = initClass.constructor.name;
            eval('window.' + className + ' = initClass');
        } else {
            console.error("M2Scripts is not defined");
        }
    }
});