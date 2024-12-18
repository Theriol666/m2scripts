let m2ScriptsInitretry = 1,
m2ScriptsInitmaxRetry = 5,
m2ScriptsInitTimeoutInterval = 2000;

function initM2Script(Class){
    if (typeof Class === "undefined" && m2ScriptsInitretry <= m2ScriptsInitmaxRetry) {
        setTimeout(function() { initM2Script(Class) }, m2ScriptsInitTimeoutInterval);
        m2ScriptsInitretry++;
    } else if(typeof Class !== "undefined") {
        // load the class and assign the class name to the window context
        let initClass = new Class();
            className = initClass.constructor.name;
        eval('window.' + className + ' = initClass');
    } else {
        console.error("M2Scripts is not defined");
    }
}