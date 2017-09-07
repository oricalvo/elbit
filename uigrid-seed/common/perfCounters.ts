import {appModule} from "./appModule";
import * as ngHooks from "./ngHooks"

export const counters:Counter[] = [] ;
let $rootScope;

declare var chrome;

export interface Counter {
    name: string;
    getValue(): number;
    reset(): void;
}

export class SimpleCounter implements Counter {
    name: string;
    value: number;

    constructor(name: string) {
        this.name = name;
        this.value = 0;
    }

    getValue():number {
        return this.value;
    }

    reset() {
        this.value = 0;
    }
}

export class DelegateCounter implements Counter {
    name: string;
    fn: ()=>number;

    constructor(name: string, fn: ()=>number) {
        this.name = name;
        this.fn = fn;
    }

    getValue():number {
        return this.fn();
    }

    reset() {
    }
}

export class AverageCounter implements Counter {
    name: string;
    sum: number;
    size: number;
    values: number[];
    take: number;
    upperLimit: number;

    constructor(name: string, take: number = 0, upperLimit?: number) {
        this.take = take;
        this.name = name;
        this.upperLimit = upperLimit;

        this.reset();
    }

    getValue():number {
        return Math.ceil(this.sum / this.size * 100) / 100;
    }

    add(value: number) {
        this.sum += value;
        ++this.size;

        if(this.take) {
            this.values.push(value);

            if(this.values.length > this.take) {
                var val = this.values.shift();
                this.sum -= val;
                --this.size;
            }
        }
    }

    dump() {
        if(this.upperLimit && this.getValue() > this.upperLimit) {
            console.warn("    " + this.name + ": " + this.getValue() + " > " + this.upperLimit);
        }
        else {
            console.log("    " + this.name + ": " + this.getValue());
        }
    }

    reset() {
        this.sum = 0;
        this.size = 0;
        if(this.take) {
            this.values = [];
        }
    }
}

export class MaxCounter implements Counter {
    name: string;
    value: number;

    constructor(name: string) {
        this.name = name;
        this.value = 0;
    }

    getValue():number {
        return this.value;
    }

    set(value: number) {
        if(value > this.value) {
            this.value = value;
        }
    }

    reset() {
        this.value = 0;
    }
}

export function monitorWatchersCount() {
    addCounter(new DelegateCounter("watchers", ()=> {
        return $rootScope.$$watchersCount;
    }));
}

export const counterMergeData = new AverageCounter("Merge data", 100);

export const counterDigestAverage = new AverageCounter("$digest avg", 100);

export function monitorDigest() {
    var $rootScope = $rootScope;

    addCounter(counterMergeData);

    var counterHeapSize = new SimpleCounter("heap size (KB)");
    addCounter(counterHeapSize);

    var counterLastDigest = new SimpleCounter("$digest last");
    addCounter(counterLastDigest);

    addCounter(counterDigestAverage);

    //var counterDigestTotalTime = new SimpleCounter("$digest total");
    //addCounter(counterDigestTotalTime);

    var counterDigests = new SimpleCounter("$digest count");
    addCounter(counterDigests);

    var counterLastIteration = new AverageCounter("iterations last", 1);
    addCounter(counterLastIteration);

    var counterIterationAverage = new AverageCounter("iterations avg");
    addCounter(counterIterationAverage);

    var counterMaxIterations = new MaxCounter("iterations max");
    addCounter(counterMaxIterations);

    (function() {
        var before:number;

        ngHooks.events.subscribe(ngHooks.APPLY_BEGIN, args => {
            before = performance.now();
        });

        ngHooks.events.subscribe(ngHooks.APPLY_END, function (args) {
            //
            //  the perfCounter component might be created in the middle of digest cycle
            //  in that case the component sees only the APPLY_END event without APPLY_BEGIN
            //
            if(before) {
                var after = performance.now();

                var time = after - before;
            }
        });
    })();

    (function() {
        var before:number;

        ngHooks.events.subscribe(ngHooks.DIGEST_BEGIN, args => {
            before = performance.now();

            counterDigests.value++;

            if (args.scope == $rootScope) {
            }
        });

        ngHooks.events.subscribe(ngHooks.DIGEST_END, function (args) {
            //
            //  the perfCounter component might be created in the middle of digest cycle
            //  in that case the component sees only the DIGEST_END event without DIGEST_BEGIN
            //
            if(before) {
                var after = performance.now();
                var time = Math.floor((after - before) * 100) / 100;

                counterLastDigest.value = time;
                counterDigestAverage.add(time);
                counterLastIteration.add(args.iterationCount);
                counterIterationAverage.add(args.iterationCount);
                counterMaxIterations.set(args.iterationCount);
                //counterDigestTotalTime.value += time;
            }
        });
    })();

    (function () {
        var extensionId = "jjbcjjaplkgeopcopfkndifekhclccka";
        var port = chrome.runtime.connect(extensionId, {name: "SDKWeb"});

        port.postMessage({type: "MONITOR_HEAP_SIZE"});

        port.onMessage.addListener(function (msg) {
            if (msg.type == "HEAP_SIZE_CHANGED") {
                console.log("HEAP_SIZE_CHANGED", msg.heapSize);

                counterHeapSize.value = Math.floor(msg.heapSize / 1024);
            }
        });
    })();
}

export function addCounter(counter: Counter) {
    counters.push(counter);
}

appModule.run(["$rootScope", function(_$rootScope) {
    $rootScope = _$rootScope;

    monitorWatchersCount();
    monitorDigest();
}]);

window["perfCounters"] = {
    dump: function() {
        console.log("Performance counters");
        for(let counter of counters) {
            if(counter["dump"]) {
                counter["dump"]();
            }
            else {
                console.log("    " + counter.name + ": " + counter.getValue());
            }
        }
    },

    reset: function() {
        for (let counter of counters) {
            counter.reset();
        }
    }

}
