this.lifezoo = this.lifezoo != undefined ? this.lifezoo : {};
this.lifezoo.helpers = {
        fileExt: function (filename) { return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined; },
		ajax: function (config /* url, success, error, type, async */) {
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
                    var ext = helper.fileExt(config.url)[0];
                    config.fileExt = ext;
                    config[ext] = xmlhttp.responseText;

					if (config.success) config.success(config);
				}
				if (xmlhttp.readyState > 1 && xmlhttp.status == 400) {
				    config.error = xmlhttp.responseText;
					if (config.error) config.error(config);
				}
			};

			var nocache = helper.guid();
            xmlhttp.open(config.ajaxType, config.url + "?" + nocache, config.async);
			xmlhttp.setRequestHeader("pragma", "no-cache");
			xmlhttp.send();

			return config;
		},
		guid: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);

			});
		},
		typeOf: function (value) {
		    var s = typeof value;
		    if (s === 'object') {
		        if (value) {
		            if (Object.prototype.toString.call(value) == '[object Array]') {
		                s = 'array';
		            }
		        } else {
		            s = 'null';
		        }
		    }
		    return s;
		},
		typeName: function (obj) {
		    if (obj == null) return "Null";
		    if (obj == undefined) return "Undefined";
		    var funcNameRegex = /function (.{1,})\(/;
		    var results = (funcNameRegex).exec((obj).constructor.toString());
		    return (results && results.length > 1) ? results[1] : "";
		},
		cache: function (key, value) {
		    var store = sessionStorage || localStorage || undefined;

		    if (typeof (store) !== "undefined") {
		        if (value) {
		            //means i am saving this item
		            store[key] = value;
		            return value;
		        } else {
		            //means i am retieving this item
		            return store[key] || null;
		        }
		    } else return undefined;
		},
		getName: function (url) {
		    var uSplit = (url.path || url).split("/");
		    var filename = uSplit[uSplit.length - 1].split(".")[0];
		    return uSplit[0] + "_" + filename;
		},
		getUrl: function (url) {
		    var uSplit = url.split("/");
		    if (uSplit.length == 2 && config.paths[uSplit[0]]) {
		        var shortUrl = config.paths[uSplit[0].path || uSplit[0]];
		        return shortUrl + uSplit[1];
		    }
		    return url;
		},
	};

