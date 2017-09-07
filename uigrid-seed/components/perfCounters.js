"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appModule_1 = require("../common/appModule");
var perfCounters = require("../common/perfCounters");
var jQuery = require("jquery");
var PerfCountersComponent = /** @class */ (function () {
    function PerfCountersComponent($rootScope, $element) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$element = $element;
        this.counters = perfCounters.counters;
        jQuery("body").on("keydown", function (e) {
            if (e.keyCode == 80 && e.shiftKey && e.altKey) {
                _this.$element.toggleClass("active");
            }
        });
    }
    PerfCountersComponent.prototype.resetAll = function () {
        for (var _i = 0, _a = this.counters; _i < _a.length; _i++) {
            var counter = _a[_i];
            counter.reset();
        }
    };
    PerfCountersComponent.prototype.reset = function (counter) {
        counter.reset();
    };
    return PerfCountersComponent;
}());
exports.PerfCountersComponent = PerfCountersComponent;
appModule_1.appModule.component("perfCounters", {
    controller: ["$rootScope", "$element", PerfCountersComponent],
    template: require("./perfCounters.html!text"),
    styles: require("./perfCounters.css!css"),
});
//# sourceMappingURL=perfCounters.js.map