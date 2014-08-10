LifeZoo.Configure({
    debug: true,
    xsocket: {
        "path": "ws://" + location.hostname + ":4502",
        "controller": ["lzconfig", "lzcontent"]
    },
    // paths allow shortening url for script/html/css loading
    paths: {
        "xsockets": "scripts/lib/xsockets/",
        "lifezoo": "scripts/lib/lifezoo/",
        "zepto": "scripts/lib/zepto/" ,
        "jquery": "scripts/lib/jquery/" ,
        "modernizr": "scripts/lib/modernizr/" ,
        "bootstrap": "scripts/lib/bootstrap/" ,
        "plugins": "scripts/app/plugins/" ,
        "controllers": "scripts/app/controllers/" ,
        "models": "scripts/app/models/" ,
        "views": "scripts/app/views/" 
    },
    // requiredLibs are loaded and kept running forever
    requiredLibs: [
        { "name": "xsockets", "path": "xsockets/xsockets.latest.beta.js" },
        //{ "name": "jquery", "path": "jquery/jquery-1.10.2.js" },
        //{ "name": "bootstrap", "path": "bootstrap/bootstrap.js" },
        //{ "name": "modernizr", "path": "modernizr/modernizr-2.6.2.js" },
    ]
}).on(function () {
    LifeZoo.CommunicationChannel.InitChannel();
    LifeZoo.Navigation.InitNavigation();
    console.warn("DONE CALLED");
});