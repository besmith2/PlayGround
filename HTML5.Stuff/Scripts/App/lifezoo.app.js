lifezoo.configure({
    debug: true,
    cache: {
        scripts:true,
        views:true,
        models:true,
        viewModels:true,
        controllers: true,
        plugins: true
    },
    // paths allow shortening url for script/html/css loading
    paths: [
        { "name": "lifezoo", "path": "/scripts/lib/lifezoo/" },
        { "name": "zepto", "path": "/scripts/lib/zepto/" },
        { "name": "jquery", "path": "/scripts/lib/jquery/" },
        { "name": "modernizr", "path": "/scripts/lib/modernizr/" },
        { "name": "bootstrap", "path": "/scripts/lib/bootstrap/" },
        { "name": "plugins", "path": "/scripts/app/plugins/" },
        { "name": "controllers", "path": "/scripts/app/controllers/" },
        { "name": "models", "path": "/scripts/app/models/" },
        { "name": "views", "path": "/scripts/app/views/" }
    ],
    // requiredLibs are loaded and kept running forever
    requiredLibs: [
        { "name": "jquery", "path": "jquery/jquery-1.10.2.js" },
        { "name": "modernizr", "path": "modernizr/modernizr-2.6.2.js" },
        { "name": "bootstrap", "path": "bootstrap/bootstrap.js" },
    ],
    //route define the site pages
    routes: [
         { routeUrl: "shell", controller: "controllers/shell.js", model: "", view: "views/shell.html", title: "Homepage" },
         { routeUrl: "index", controller: "controllers/index.js", model: "index", view: "index", title: "Homepage" },
         { routeUrl: "test1", controller: "controllers/test1.js", model: "test1", view: "test1", title: "Test page 1" }
    ],
    setRoot: "shell"
});