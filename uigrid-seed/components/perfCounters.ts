import {appModule} from "../common/appModule";
import {Counter} from "../common/perfCounters";
import * as perfCounters from "../common/perfCounters";
import * as jQuery from "jquery";

export class PerfCountersComponent {
    counters:Counter[];

    constructor(private $rootScope, private $element) {
        this.counters = perfCounters.counters;

        jQuery("body").on("keydown", e => {
            if(e.keyCode == 80 && e.shiftKey && e.altKey) {
                this.$element.toggleClass("active");
            }
        });
    }

    resetAll() {
        for(let counter of this.counters) {
            counter.reset();
        }
    }

    reset(counter: Counter) {
        counter.reset();
    }
}

appModule.component("perfCounters", <any>{
    controller: ["$rootScope", "$element", PerfCountersComponent],
    template: require("./perfCounters.html!text"),
    styles: require("./perfCounters.css!css"),
});
