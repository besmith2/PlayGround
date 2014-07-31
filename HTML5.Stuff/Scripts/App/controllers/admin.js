lifezoo.controller("admin",
    {
        models: [
            { name: "model1", path: "models/model1.js" },
            { name: "model2", path: "models/model2.js"}
        ],
        view: [
            {name:"admin", path: "views/model2.html"}
        ],
        load: function (model1, model2, adminView) {

        }
    }
);