import {appModule} from "../common/appModule";

declare var $;

export class AppComponent {
    gridOptions;

    constructor($element) {
        var mockData = [
            {
                "firstName": "Cox",
                "lastName": "Carney",
                "company": "Enormo",
                "employed": true
            },
            {
                "firstName": "Lorraine",
                "lastName": "Wise",
                "company": "Comveyer",
                "employed": false
            },
        ];

        var data = [];
        for (var i = 0; i < 5000; i++) {
            for (var j = 0; j < 2; j++) {
                data.push(Object["assign"]({}, mockData[j], {id: i * 2 + j}));
            }
        }

        this.gridOptions = {
            enableFiltering: true,
            data: data,
        };
    }
}

appModule.component("myApp", {
    controller: AppComponent,
    template: require("./app.html!text"),
});

appModule.directive("uiGridCell", function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            const events = $._data(element[0], "events");
            if (!events) {
                console.warn("Failed to retrive events data from HTML element. Single click edit will not work");
                return;
            }

            const handlers = events["dblclick"];

            if (!handlers || !handlers.length) {
                console.warn("Did not find any dblclick handler for uiGridCell. Single click edit will not work");
                return;
            }

            if (handlers.length > 1) {
                console.warn("Found too many handlers for dblclick event. Can't determine which one to use. Single click edit will not work");
                return;
            }

            const handler = handlers[0];
            const func = handler.handler;
            if (!func || typeof func != "function") {
                console.warn("Unexpected handler scheme. Expected handler field to be a function");
                return;
            }

            //
            //  Remove original dblclick support
            //
            element.off("dblclick", handler);

            //
            //  Install click support
            //
            element.on("click", function () {
                func();
            });
        }
    }
});
