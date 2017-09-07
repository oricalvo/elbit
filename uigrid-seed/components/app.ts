import {appModule} from "../common/appModule";

declare var $;

export class AppComponent {
    gridOptions;

    constructor($element) {
        var mockData = [{
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

        // setTimeout(function() {
        //     console.log($element.find(".ui-grid-cell").length);
        //
        //     $element.find(".ui-grid-cell").bind("click", function() {
        //         const me = this;
        //
        //         setTimeout(function() {
        //             const elem = $(me);
        //
        //
        //         }, 1000);
        //     });
        // }, 1000);
    }
}

appModule.component("myApp", {
    controller: AppComponent,
    template: require("./app.html!text"),
});

appModule.directive("uiGridCell", function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            //console.log(element);

            //element.off("dblclick");

            const events = $._data(element[0], "events");
            if(!events) {
                console.warn("Failed to retrive events data from HTML element. Single click edit will not work");
                return;
            }

            const handlers = events["dblclick"];

            if(!handlers || !handlers.length) {
                console.warn("Did not find any dblclick handler for uiGridCell. Single click edit will not work");
                return;
            }

            if(handlers.length > 1) {
                console.warn("Found too many handlers for dblclick event. Can't determine which one to use. Single click edit will not work");
                return;
            }

            const handler = handlers[0];

            element.off("dblclick", handler);

            element.on("click", function() {
                handler();
            });
        }
    }
});
