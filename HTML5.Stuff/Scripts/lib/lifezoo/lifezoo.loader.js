
var lifezoo = (function () {
    var debug = false;
    var getUrl = function (url) {
        var uSplit = url.split("/");
        if (uSplit.length == 2 && config.paths[uSplit[0]]) {
            var shortUrl = config.paths[uSplit[0].path || uSplit[0]];
            return shortUrl + uSplit[1];
        }
        return url;
    };
    var getName = function (url) {
        var uSplit = (url.path || url).split("/");
        var filename = uSplit[uSplit.length - 1].split(".")[0];
        return uSplit[0] + "_" + filename;
    };
    var typeName = function (obj) {
        if (obj == null) return "Null";
        if (obj == undefined) return "Undefined";
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    var guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);

        });
    };
    var fileExt = function (filename) { return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined; };


    var getLZType = function (script) {
        if (/.*plugin*\(.*/.test(script)) return "plugin";
        if (/.*model*\(.*/.test(script)) return "model";
        if (/.*controller*\(.*/.test(script)) return "controller";
        return "unknown";
    };



    //////var bgAjax = new Worker("scripts/WebWorkers/ww.lifezoo.fileloader.js")
    ////var bgAjaxPostMessage = function (msg) {
    ////    if (sessionStorage[msg.url] != undefined) {
    ////        bgAjaxOnMessage(JSON.parse(sessionStorage[msg.url]));
    ////    } else {
    ////        bgAjax.postMessage(msg);
    ////    }
    ////};
    ////var bgAjaxOnMessage = function (data) {
    ////    if (data.js) {
    ////        loadEval(data);
    ////    }
    ////};

    ////bgAjax.onmessage = function (event) {
    ////    if(!debug) sessionStorage[event.data.url] = JSON.stringify(event.data);
    ////    bgAjaxOnMessage(event.data);

    ////}

    ////bgAjax.onerror = function () {
    ////    lz.warn("bgAjax.onerror", arguments);
    ////};

    var config = {};
    var loadTagSync = function (path, lib, callback) {

            var head = document.getElementsByTagName('head')[0];
            var node = document.createElement("script");
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.onreadystatechange = node.onload = function () {
                var state = node.readyState;
                if (!callback.done && (!state || /loaded|complete/.test(state))) {
                    callback.done = true;
                    console.warn("onload", path, new Date());
                    callback();
                    
                }
            };
            
            node.src = path;
            node.setAttribute('data-src', lib);
            node.setAttribute('data-dynamic', lib);
            console.warn("download", path, new Date());
            head.appendChild(node);
           

    };
    var loadTagString = function (script, lib, callback) {
        $("<script />")
            .attr("charset", "utf-8")
            .attr("type", "text/javascript")
            .attr("data-requiredLib", lib)
            .text(script).appendTo("head");
    };
    var loadEval = function (script) {
        switch (script.type + ":" + script.fileExt) {
            case "required:lib:js":
                eval.call(window, script.js);
                break;
            case "lz:lib:js":
                var lzType = getLZType(script.js);
                var found = null;

                for(var i=0; i<lz.loaded.map.length;i++) {
                    var item = lz.loaded.map[i];
                    if (item.type == lzType && item.name == script.name) {
                        found = item;
                        break;
                    }
                }



                if (found==null) {
                    lz.loaded.map.push({ "type": lzType, "name": script.name });
                    var jsLoad = eval(script.js);
                    jsLoad.__guid = script.id;
                    jsLoad.__type = lzType;
                    jsLoad.__name = script.name;
                    lz.loaded[lzType].push(jsLoad);
                } 
                break;
        }

    };

    var loader = new (function () {
        var ajax = function (config /* url, type, async */) {
        var xmlhttp, responseText;
            // code for IE7+, Firefox, Chrome, Opera, Safari
        console.warn(config);
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

        //var nocache = guid();
        xmlhttp.open(config.ajaxType, config.url , config.async);
        xmlhttp.setRequestHeader("pragma", "no-cache");
        xmlhttp.send();

        return config;
    };
        var self = this;
        var queue = { // { group-id, callback, required [ path { method, type, name, url, path, ajax-complete, eval-complete, fileExt }] 
            "ajax-queue": {},
            "eval-loaded": {},
            "ajax-loaded": {},
            "group-callbacks": {},
            "isLoading": function (qItem) {
                for (var i in this.lookup) {
                    if (qItem.path == i && qItem.loaded == false) {
                        return false;
                    }
                }
            },
            "isLoaded": function (qItem) {
                for (var i in this.lookup) {
                    if (qItem.path == i && qItem.loaded == true) {
                        return false;
                    }
                }
            },
            "push": function (group, callback) {
                this["group-callbacks"][group["group-id"]] = callback;
                group["count"] = group.required.length;
                for (var i = 0, len = group["count"]; i < len; i++) {
                    var cachedItem = queue.srcCache(group.required[i].url).cache;
                    if (cachedItem != null || cachedItem != undefined) {
                        group["count"]--;
                        group.required[i]["ajax-complete"] = true;
                        group.required[i][group.required[i].fileExt] = cachedItem;
                        group.required[i].type = getLZType(group.required[i][group.required[i].fileExt]);
                    }
                }

                this["ajax-queue"][group["group-id"]] = group;
            },
            "srcCache" : function (path) {
                return {
                    url: path,
                    get cache () {
                        var cachedItem = sessionStorage[this.url];
                        if (cachedItem != undefined) {
                            return cachedItem;
                        } else {
                            return null;
                        };
                    },
                    set cache (msg) {
                        sessionStorage[this.url] = msg;
                    },
                }
            },
            "ajax-start": function (groupId) {
                var indx = [groupId];

                var loadit = function (callback, indxQueue) {
                    if (queue["ajax-queue"][indxQueue].required.length > 0) {
                        var requiredItem = queue["ajax-queue"][indxQueue].required.shift();
                        if (requiredItem["ajax-complete"] == false) {
                            var cachedItem = queue.srcCache(requiredItem.url).cache;
                            if (cachedItem == null || cachedItem == undefined) {
                                requiredItem.success = function () {

                                    queue.srcCache(requiredItem.url).cache = requiredItem[requiredItem.fileExt];

                                    queue["ajax-loaded"][requiredItem.url] = requiredItem;
                                    requiredItem.type = getLZType(requiredItem[requiredItem.fileExt]);
                                    setTimeout(function () {
                                        loadit(callback, indxQueue);
                                    }, 0);
                                };
                                requiredItem.error = function () {
                                    console.error("requiredItem.error", arguments);
                                    setTimeout(function () {
                                        loadit(callback, indxQueue);
                                    }, 0);
                                };
                                requiredItem.ajaxType = "GET";
                                requiredItem.async = "true;"
                                ajax(requiredItem);
                            } else {
                                requiredItem[requiredItem.fileExt] = cachedItem;
                                queue["ajax-loaded"][requiredItem.url] = requiredItem;
                                console.warn(requiredItem);
                                setTimeout(function () {
                                    loadit(callback, indxQueue);
                                }, 0);
                            }
                        } else {
                            console.warn(requiredItem);
                            queue["ajax-loaded"][requiredItem.url] = requiredItem;
                            setTimeout(function () {
                                loadit(callback, indxQueue);
                            }, 0);
                        }

                    } else {
                        callback();
                    }
                }
                var evalit = function (callback) {
                    for (var i in queue["ajax-loaded"]) {
                        queue["eval-loaded"][i] = eval(queue["ajax-loaded"][i].js);
                        queue["ajax-loaded"][i] = null;
                        delete queue["ajax-loaded"][i];
                    }
                    callback();
                };
                loadit(function () {
                    queue["ajax-queue"][groupId] = null;
                    delete queue["ajax-queue"][groupId];

                    //eval these and remove from ajax-loaded
                    evalit(function () {
                        //call the callback
                        queue["group-callbacks"][groupId]();
                        //delete the callback
                        delete queue["group-callbacks"][groupId];
                        
                    });
                }, indx);
                
            }
        };  
        var loaded = {};        // { path {object}
        var itemLookup = {};    // { path {group, index} }



        self.fetch = function (reqs, callback) {
            queue["push"](reqs, callback);
            queue["ajax-start"](reqs["group-id"]);
        };
        
        self.start = function (groupId) {
            //bgAjax.post
            return self;
        };

        self.init = function () {
            return self;
        };

        return self.init();
    });

    var lz = function (req, callback) {
        var g = guid();
        var reqGroup = { "group-id": g, "method": "lz:load", "required": [] };

        if (typeName(req) == "String") {
            var g = guid();
            var pReq = '{ "type": "lz:lib", "name": "' + getName(req) + '", "url": "' + getUrl(req) + '", "path": "' + req + '", "ajax-complete": false, "fileExt": "' + fileExt(req) + '", "' + fileExt(req) + '":"", "eval-complete": false, "eval-object": null }';
            reqGroup.required.push(JSON.parse(pReq));
        }

        if (typeName(req) == "Array") {
            req.forEach(function (item) {
                var pReq = '{ "type": "lz:lib", "name": "' + getName(item.path) + '", "url": "' + getUrl(item.path) + '", "path": "' + item.path + '", "ajax-complete": false, "fileExt": "' + fileExt(item.path) + '", "' + fileExt(item.path) + '":"", "eval-complete": false, "eval-object": null }';
                reqGroup.required.push(JSON.parse(pReq))
            });
        }

        loader.fetch(reqGroup, function () {
            delete reqGroup;
            console.warn("loader.fetch.complete");
        });

        //if (callback != undefined) {
        //    var args = [];
        //    req.forEach(function (tReq) {
        //        var found = null;
        //        for (var i = 0; i < lz.loaded.map.length; i++) {
        //            var item = lz.loaded.map[i];
        //            if (item.name == tReq) {
        //                found = item;
        //                break;
        //            }
        //        }

        //        if(found!=null)


        //        console.warn(item);
        //    });
        //}

    };

    lz.loaded = {
        map:[],
        model: [],
        controller: [],
        view: [],
        plugin: [],
        unloadController: function () {
            controller = null;
            return lz.loaded;
        },
        unloadModels: function () {
            for (var t in lz.loaded.model)
            {
                lz.loaded.model[t] = null;
            }
            return lz.loaded;
        },
        addController: function(controller){
            lz.loaded.controller = controller;
            return lz.loaded;
        },
        addModel: function(model){
            lz.loaded.model[model.__name] = model;
            return lz.loaded;
        }
    };
    lz.cleanup = function () {
        for (var t in lz.loaded.model) {
            lz.loaded.model[t] = null;
            delete lz.loaded.model[t];
        }
        lz.loaded.model = null;
        lz.loaded.model = {};

        //loadingReqs = null;
        //watchReqGroup = null;

        //loadingReqs = {};
        //watchReqGroup = {};

        //console.warn(lz.loaded.model);
    };
    lz.printout = function () {

    };

    lz.version = "0.8.5";
    lz.warn = function (msg) {
        //console.warn("lifezoo - ",arguments)
    };
    lz.asyncLoad = function (arry) {
        var completeCount = arry.length;
        var processing = false;
        var callService = function () {
            if (!processing) {
                def();
            }
            if (arry.length == 0) {
                return "DONE";
            } else {
                return callService();
            }

        }
        var def = function () {
            if (!processing) {

                var entry = arry.shift();
                if (entry != null) {
                    lz.warn("loadTagSync -- Loading", entry.path, new Date().getTime(), processing);

                    loadTagSync(entry.path, "requiredLibs-" + entry.name, function () {
                        lz.warn("loadTagSync -- complete", entry.path, new Date().getTime());

                        processing=false;
                    });
                }
                return;
            } else {
                     lz.warn("loadTagSync -- Loading", entry.path, new Date().getTime(), processing);
              return;
            }
        };
        return callService();
    };
    lz.configure = function (cfg) {
        /*
        debug
        cache
            
        paths           {name,path}
        requiredLibs    {name,path}
        routes          {name,path}
        */
        delete config.paths;
        var g = guid();

        config.paths = {};

        cfg.paths.forEach(function (item) {
            config.paths[item.name] = item.path;
        });

        var loadReqs = function (callback) {
            if(cfg.requiredLibs.length > 0){
                var item = cfg.requiredLibs.shift();
                
                loadTagSync(getUrl(item.path), item.name, function () {
                    setTimeout(loadReqs, 0, callback);
                });   
            } else {
                callback();
            }
        };
        setTimeout(loadReqs, 0, function () {
            console.warn("loadReqs-callback")
        });


    };

    lz.init = function () {
        var appBootStrap = document.querySelector('[data-lzapp]').getAttribute("data-lzapp");
        loadTagSync(appBootStrap, "lifezoo.app", function () {
            console.warn("bootstrap.loaded");
        });

    };


    lz.model = function (name, model) {
        //if (lifezoo.helpers.typeName(name) != "String") model = name;
        //lz.warn("lz.model", name, lifezoo.helpers.typeName(model), model.type);
        return model;
    };
    lz.view = function (name, view) {

    };
    lz.controller = function (name, controller) {

    };

    return lz;
})();
window.lifezoo = lifezoo;
lifezoo.init();

