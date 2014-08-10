lifezoo.controller("admin",
    {
        view: {name:"admin", path: "views/model2.html"},
        viewModel: { name: "viewModel", path: "models/model1.js" },
        plugins: [
            { name: "plugin1", path: "plugins/plugin1.js" },
            { name: "plugin2", path: "plugins/plugin2.js" }
        ],


        viewOnLoad: function (view) {
            return view;
        },
        viewModelOnLoad: function (viewModel) {
            return viewModel;
        },
        pluginsOnLoad: function(plugins){
            return plugins;
        },

        onLoad: function (view, viewModel, plugins) {

            return true;
        },
        onUnload: function (view, viewModel, plugins) {

            return true;
        }
    }
);