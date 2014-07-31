var scriptQueue = [];
var loadingScript = null;
var thread = null;
var guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);

    });
};
var ajax = function (config /* url, success, error, type, async */) {
    var xmlhttp, responseText;
    // code for IE7+, Firefox, Chrome, Opera, Safari
    if (XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            responseText = xmlhttp.responseText;

            config[config.fileExt] = xmlhttp.responseText;

            if (config.success) config.success(config);
        }
        if (xmlhttp.readyState > 1 && xmlhttp.status == 400) {
            config.error = xmlhttp.responseText;
            if (config.error) config.error(config);
        }
    };

    var nocache = guid();
    xmlhttp.open(config.ajaxType, config.url + "?" + nocache, config.async);
    xmlhttp.setRequestHeader("pragma", "no-cache");
    xmlhttp.send();

    return config;
};

self.onmessage = function (event) {
    var msg = event.data;

	if (msg.method && msg.method != "init") {
	    msg.ajaxType = "GET";
	    msg.success = success;
	    msg.error = error;
	    msg.async = true;
	    //newArray.push.apply(newArray, dataArray1);
	    scriptQueue.push(msg);
	    console.warn(scriptQueue);
		setTimeout(processQueue, 10);
	} else {
		postMessage({ msg: "ww.lifezoo.fileloader Init complete!" });
	}
};

var processQueue = function () {
	if (scriptQueue.length == 0) {
		return;
	}
	
	if (loadingScript != null) {
		setTimeout(processQueue, 35);
		return;
	}

	loadingScript = scriptQueue.shift();
	ajax(loadingScript);
};
var success = function (msg) {
    loadingScript = null;

    msg.ajaxType = null;
    msg.success = true;
    msg.error = false;
    msg.msg = "COMPLETE";


	postMessage(msg);
};
var error = function (msg) {
	loadingScript = null;
	msg.success = false;
	msg.error = true;
	postMessage(msg);
};
