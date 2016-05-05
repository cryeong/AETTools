(function(){
    window.prefix_url = "";
    window.cssprerequisites= [];
    window.jsprerequisites= ['svggl/svggl.js','aettool.js'];
    window.cssdependencies = [];
    window.jsdependencies= [];
    window.cssextras= [];
    window.jsextras= [];
    var d=document,
    b=d.body,
    boot= function() {
        // after load do something here or leave this empty
        var ate = new ATEditor();
        ate.port.setAttribute('style','position:fixed !important; top:0px !important; left:0px !important; width:100% !important; height:100% !important;');
        b.insertBefore(ate.port,b.firstChild);
        ate.port.style.zIndex = 9999;
    };
    loadCSS=function() {
        if(cssdependencies.length>0) {
            var cssfile = cssdependencies.shift();
            var isAbsolute = cssfile.indexOf('http') > -1;
            var lk = d.createElement('link');
            lk.setAttribute('rel', 'stylesheet');
            lk.setAttribute('type', 'text/css');
            lk.href = (isAbsolute?'':window.prefix_url)+cssfile;
            if(isAbsolute)
                document.getElementsByTagName("head")[0].appendChild(lk);
            else
                document.getElementsByTagName("body")[0].appendChild(lk);
            loadCSS();
        } else {
            jsdependencies = jsprerequisites.concat(jsdependencies, jsextras);
            loadJS();
        }
    };
    loadJS=function() {
        if(jsdependencies.length>0) {
            var jsfile = jsdependencies.shift();
            var isAbsolute = jsfile.indexOf('http') > -1;
            var sp = d.createElement('script');
            sp.setAttribute('type', 'text/javascript');
            sp.setAttribute('src',(isAbsolute?'':window.prefix_url)+jsfile);
            if(isAbsolute)
                document.getElementsByTagName("head")[0].appendChild(sp);
            else
                document.getElementsByTagName("body")[0].appendChild(sp);
            sp.onload = function(e) {loadJS();};
        } else {
            boot();
        }
    };
    prepare=function() {
        function onCreateElementNsReady(func) {
            if (document.createElementNS != undefined) {
                func();
            } else {
                setTimeout(function() { onCreateElementNsReady(func); }, 100);
            }
        }
        onCreateElementNsReady(function() {
            cssdependencies = cssprerequisites.concat(cssdependencies, cssextras);
            loadCSS();
        });
    };
    prepare();
}());
