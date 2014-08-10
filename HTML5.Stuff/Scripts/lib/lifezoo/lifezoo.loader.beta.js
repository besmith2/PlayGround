//beta

var LifeZoo = {
    Notes: "This version is based on XSockets",
    Version: "0.4b",
    ContentHolder:{},
    Callbacks: {},
    Config: {},
    Utils: {
        parseURL: function (url) {
            var a = document.createElement('a'), parms = [],
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;

            a.href = url;
            while (len--) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                parms.push({ key: s[0], value: s[1] });
            }


            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                requestParams: parms,
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        },
        getUrl: function (url) {
            var uSplit = url.split("/");
            if (uSplit.length == 2 && LifeZoo.Config.paths[uSplit[0]]) {
                var shortUrl = LifeZoo.Config.paths[uSplit[0].path || uSplit[0]];
                return shortUrl + uSplit[1];
            }
            return url;
        },
        getName: function (url) {
            var uSplit = (url.path || url).split("/");
            var filename = uSplit[uSplit.length - 1].split(".")[0];
            return uSplit[0] + "_" + filename;
        },
        typeName: function (obj) {
            if (obj == null) return "Null";
            if (obj == undefined) return "Undefined";
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((obj).constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        },
        extend: function (obj, extObj) {
            if (arguments.length > 2) {
                for (var a = 1; a < arguments.length; a++) {
                    this.extend(obj, arguments[a]);
                }
            } else {
                for (var i in extObj) {
                    obj[i] = extObj[i];
                }
            }
            return obj;
        },
        guid: function (a, b) {
            for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
            return b;
        },
        getLZType: function (script) {
            if (/.*lifezoo.plugin*\(.*/.test(script)) return "plugin";
            if (/.*lifezoo.model*\(.*/.test(script)) return "model";
            if (/.*lifezoo.controller*\(.*/.test(script)) return "controller";
            return "unknown";
        },
        include: function (path, lib, callback) {
            var head = document.getElementsByTagName('head')[0];
            var node = document.createElement("script");
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.onreadystatechange = node.onload = function () {
                var state = node.readyState;
                if (!callback.done && (!state || /loaded|complete/.test(state))) {
                    callback.done = true;
                    callback();
                }
            };
            node.src = path;
            node.setAttribute('data-src', lib);
            head.appendChild(node);
        },
        contentLoaded: function (win, fn) {

            var done = false, top = true,

            doc = win.document, root = doc.documentElement,

            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',

            init = function (e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function () {
                try { root.doScroll('left'); } catch (e) { setTimeout(poll, 50); return; }
                init('poll');
            };

            if (doc.readyState == 'complete') fn.call(win, 'lazy');
            else {
                if (doc.createEventObject && root.doScroll) {
                    try { top = !win.frameElement; } catch (e) { }
                    if (top) poll();
                }
                doc[add](pre + 'DOMContentLoaded', init, false);
                doc[add](pre + 'readystatechange', init, false);
                win[add](pre + 'load', init, false);
            }

        },
        extend: function (obj, extObj) {
            if (arguments.length > 2) {
                for (var a = 1; a < arguments.length; a++) {
                    this.extend(obj, arguments[a]);
                }
            } else {
                for (var i in extObj) {
                    obj[i] = extObj[i];
                }
            }
            return obj;
        },
        sessionCache: function (key) {
            return {
                url: key,
                get cache() {
                    if (LifeZoo.Config.Debug) return null;
                    var cachedItem = sessionStorage[this.url];
                    if (cachedItem != undefined) {
                        return cachedItem;
                    } else {
                        return null;
                    };
                },
                set cache(msg) {
                    if (LifeZoo.Config.Debug) return null;
                    sessionStorage[this.url] = msg;
                },
            }
        },
        locationCache: function (key) {
            return {
                url: key,
                get cache() {
                    if (LifeZoo.Config.Debug) return null;
                    var cachedItem = localStorage[this.url];
                    if (cachedItem != undefined) {
                        return JSON.parse(cachedItem);
                    } else {
                        return null;
                    };
                },
                set cache(msg) {
                    if (LifeZoo.Config.Debug) return null;
                    localStorage[this.url] = JSON.stringify(msg);
                },
            }
        },
        browser: (function(){
            var br = {
                hashChange: {
                    funcs: [],
                    oldHref: location.href
                }
            };
            br.addHashChange= function (func, before) {

                if ('onhashchange' in window) {
                    if (window.addEventListener) {
                        window.addEventListener('hashchange', func, before);
                    } else if (window.attachEvent) {
                        window.attachEvent('onhashchange', func);
                    }
                } else {
                    //old way watch browser history
                    if (typeof func === 'function')
                        br.hashChange.funcs[before ? 'unshift' : 'push'](func);
                    setInterval(function () {
                        var newHref = location.href;
                        if (br.hashChange.oldHref !== newHref) {
                            var _oldHref = oldHref;
                            br.hashChange.oldHref = newHref;
                            for (var i = 0; i < br.hashChange.funcs.length; i++) {
                                br.hashChange.funcs[i].call(window, {
                                    'type': 'hashchange',
                                    'newURL': newHref,
                                    'oldURL': _oldHref
                                });
                            }
                        }
                    }, 100);
                }
            };
            br.removeHashChange = function (func) {
                if ('onhashchange' in window) {
                    if (window.addEventListener) {
                        window.removeEventListener('hashchange', func);
                    } else if (window.attachEvent) {
                        window.detachEvent('onhashchange', func);
                    }
                } else {
                    //old way watch browser history
                    for (var i = br.hashChange.length - 1; i >= 0; i--) {
                        if (br.hashChange[i] === func) {
                            br.hashChange.splice(i, 1);
                        }
                    }
                }
            };

            return br;
        })(),
    }
};

LifeZoo.Init = function () {
    console.warn("LifeZoo.Init");
    LifeZoo.Utils.browser.addHashChange(LifeZoo.Navigation.HashChange, location.href);
    return LifeZoo;
};
LifeZoo.Configure = function (cfg) {
    /*
        debug
        paths           {name,path}
        requiredLibs    {name,path}
        routes          {name,path}
    */
    LifeZoo.Config.Site = location.hostname;
    LifeZoo.Config.xsocket = cfg.xsocket || {}

    LifeZoo.Config.paths = cfg.paths || {};
    //not sure I want to do this I might want to get the shell from the socket
    LifeZoo.Config.shell = cfg.shell || [];
    LifeZoo.Config.requiredLibs = cfg.requiredLibs || [];

    var onComplete = function (id, delegate) {
        if (delegate == undefined) {
            if (LifeZoo.Callbacks[id] != undefined) {
                LifeZoo.Callbacks[id].call();
                delete LifeZoo.Callbacks[id];
                LifeZoo.Init();
            }
        }
        LifeZoo.Callbacks[id] = delegate;
    }
    var loadScripts = function (c) {
        var req
        if (req = cfg.requiredLibs.shift()) {
            LifeZoo.Utils.include(LifeZoo.Utils.getUrl(req.path), req.name, function () { loadScripts(c); });
        } else {
            c.callback(c.id);
        }
    };
    var done = function (d) {
        delete cfg;
        onComplete(g, d);
    };

    var g = LifeZoo.Utils.guid();
    setTimeout(loadScripts, 0, {id: g,callback: onComplete });
    return { "on": done };
};
LifeZoo.Navigation = (function(){
    var nav = {
        Current: {
            url: {},
            Controller: {},
            ViewModel: {},
            View: "",       //html
            Plugins: [],
        }
    };
    nav.HashChange= function (e) {
        //attached to from within LifeZoo.Init
        LifeZoo.Navigation.Navigate(LifeZoo.Utils.parseURL(e.newURL), LifeZoo.Utils.parseURL(e.oldURL));
    };
    nav.Navigate= function (newUrl, oldUrl) {
        var nav = this;

        console.warn("LifeZoo.Navigation.Navigate", { "newUrl": newUrl, "oldURL": oldUrl });
        // UnloadPrevious -- call onUnLoad / unbind the view / cleanup memory / call xsocket to get newUrlContent
        var callUnloads = function () {
            var i = nav.Current.Plugins.length; //or 10
            while (i--) {
                if ("onUnLoad" in nav.Current.Plugins[i]) {
                    nav.Current.Plugins[i].onUnLoad(current);
                }
            }


            if ("onUnload" in nav.Current.ViewModel) {
                nav.C.ViewModel.onUnLoad(current);
            }

            if ("onUnload" in nav.Current.Controller) {
                nav.Current.Controller.onUnLoad(current);
            }
            return true;
        };
        var unBindView = function () {
            return true;
        };
        var cleanUpCurrent = function () {
            nav.Current.url = null;
            nav.Current.Controller = null;
            nav.Current.ViewModel = null;
            var i = nav.Current.Plugins.length;
            while(i--) {
                nav.Current.Plugins[i] = null;
            }
            nav.view = null;

            nav.Current.url = {};
            nav.Current.Controller = {};
            nav.Current.ViewModel = {};
            nav.Current.Plugins.length = 0;
            nav.view = "";


        };

        if (oldUrl != null) {
            callUnloads();
            unBindView();
            cleanUpCurrent();
        }
        //host / hash
        var cacheContent = LifeZoo.Utils.sessionCache(newUrl.host + "/#" + newUrl.hash).cache;
        if (cacheContent == null) {
            LifeZoo.CommunicationChannel.RequestByLocation(newUrl, LifeZoo.Navigation.ContentLoaded);
        } else {
            nav.ContentLoaded(cacheContent);
        }
    };
    nav.ContentLoaded = function (content) {
        /* { url: {}, Controller: {name:"", js:""},  ViewModel: {name:"", js:""}, View: {name:"", html:""}, Plugins:[ {name:"", js:""}] */
        if (typeof content === 'string') {
            content = JSON.parse(content);
            LifeZoo.Utils.sessionCache(content.url.host + "/#" + content.url.hash).cache = JSON.stringify(content);
        }
        LifeZoo.ContentHolder.innerHTML = content.view.content;
    };
    nav.InitNavigation = function () {
        nav.Navigate(LifeZoo.Utils.parseURL(location.href), null);
    };
    return nav;
})();
LifeZoo.CommunicationChannel = (function () {
    var retries = 0, maxRetries = 10;
    var cc = {
        xsocket: null,
    };
    cc.TryReconnect = function () {
        if (cc.xsocket.webSocket.readyState() == 3 && maxRetries < retries) {
            cc.OpenChannel();
            retries++;
            setTimeout(cc.TryReconnect, 100);
        }
    };
    cc.connectionError = function (e) {
        console.warn("cc.connectionError", e);
    };
    cc.onConnected = function () {
        console.warn('socket connected', cc.xsocket.webSocket.readyState())
    };
    cc.onDisconnected = function () {
        console.log('socket disconnected', cc.xsocket);
        // try reconnect
        cc.TryReconnect();
    };
    cc.OpenChannel = function () {
        if(cc.xsocket == null || cc.xsocket.webSocket.readyState() == 3)
        {
            cc.xsocket = new XSockets.WebSocket(LifeZoo.Config.xsocket.path, LifeZoo.Config.xsocket.controller);
            cc.xsocket.webSocket.getWebSocket().onerror = cc.connectionError;
            cc.xsocket.onconnected = cc.onConnected;
            cc.xsocket.ondisconnected = cc.onDisconnected;
        }
        return { LoadSiteInformation: cc.LoadSiteInformation };
    };
    cc.LoadSiteInformation = function () {
        var siteInfo = LifeZoo.Utils.locationCache("siteinformation").cache;
        if (siteInfo != null) {
            LifeZoo.Config.SiteInfo = siteInfo;
            return;
        }
        cc.xsocket.controller('LZConfig').invoke('getsiteinformation', { Site: location.hostname })
                .then(function (siteInfo) {
                    LifeZoo.Utils.locationCache("siteinformation").cache = siteInfo;
                    LifeZoo.Config.SiteInfo = siteInfo;
                    return;
                });
    };
    cc.RequestByLocation = function (newUrl, func) {
        cc.xsocket.controller('lzcontent').invoke('requestbylocation', newUrl).then(function (a) { func(a); });
    };
    cc.InitChannel = function () {
        cc.OpenChannel().LoadSiteInformation();
    };
    return cc;


})();

//load bootstrap, data-lzapp, data-lzBody
(function (win) {

    var loadBootStrap = function () {
        LifeZoo.ContentHolder = document.querySelector('[data-lzBody]');
        var appBootStrap = document.querySelector('[data-lzapp]').getAttribute("data-lzapp");
        LifeZoo.Utils.include(appBootStrap, "lifezoo.app", function () {
            console.warn("bootstrap.loaded");
        });
    };
    LifeZoo.Utils.contentLoaded(win, loadBootStrap);

})(window);


//            this.xsocket.controller('xsocket').subscribe('open', function (data) {
//                console.log("open", data);
//            });
//            this.xsocket.controller('xsocket').subscribe('timedstuff', function (data) {
//                console.log("timedstuff", data);
//            });

//            // store data on server
//            //conn.controller('chat').storageSet('color','red');
//            // get stored data from server
//            //conn.controller('chat').storageGet('color', function(data){console.log(data)});
//            // removing stored data from server
//            //conn.controller('chat').storageRemove('color');
//            //conn.controller('chat').storageClear();

//            // close
//            //conn.controller("chat").close();

//            // onerror
//            //conn.controller("chat").onerror = function (err) {
//            //    console.log(err);
//            //};

//            // set property
//            //conn.controller('chat').setProperty('username','Espen Knutsen');

//            // async
//            //chat.controller('xsocket').invoke('chatmessage', { Text: 'Hello JS RealTime', From: 'Website' });

//            // sync
//            //conn.controller('chat').invoke('echo').then(function(d){console.log(d)});

//            //blob
//            //var blob = File.ReadAllBytes(@"c:\temp\xfile.txt");
//            //conn.Controller("chat").Invoke("myfile", blob);

//            //subscribe(topic, fn, cb);
//            //one(topic, fn, cb);
//            //many(topic, n, fn, cb);

//            // subscribe one time
//            //conn.controller('chat').one('chatmessage', function (data) {
//            //    console.log(data);
//            //});

//            //subscribe (N) times
//            //conn.controller('chat').many('chatmessage', 3 function(data){
//            //    console.log(data);
//            //});



