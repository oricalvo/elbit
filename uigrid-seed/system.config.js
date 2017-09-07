SystemJS.config({
    map: {
        "angular": "node_modules/angular/angular.js",
        "jquery": "node_modules/jquery/dist/jquery.js",
        "text": "node_modules/systemjs-plugin-text/text.js",
        "css": "node_modules/systemjs-plugin-css/css.js",
        "angular-ui-grid": "node_modules/angular-ui-grid/ui-grid.js",
    },
    packages: {
        common: {
            defaultExtension: "js",
        },
        components: {
            defaultExtension: "js",
        },
    },
    meta: {
        "angular": {
            format: "global",
            exports: "angular",
            deps: ['jquery']
        },
        "jquery": {
            format: "global",
            exports: "jQuery",
        }
    }
});