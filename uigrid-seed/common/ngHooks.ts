import {EventEmitterSource, EventEmitter} from "./EventEmitter";
import {hook} from "./objectHelpers";
import {appModule} from "./appModule";

export const APPLY_BEGIN = "applyBegin";
export const APPLY_END = "applyEnd";
export const DIGEST_BEGIN = "digestBegin";
export const DIGEST_END = "digestEnd";
export const ITERATION = "iteration";
export const WATCHER_ADDING = "watcherAdding";
export const WATCHER_ADDED = "watcherAdded";
export const WATCHER_REMOVE = "watcherRemove";

var eventsSource: EventEmitterSource = new EventEmitterSource();
var $rootScope;

export var events: EventEmitter = new EventEmitter(eventsSource);

function initHooks() {
    var Scope = $rootScope.constructor;
    var iterationCount;

    hook(Scope.prototype, "$apply", function($apply) {
        return function() {
            eventsSource.raise(APPLY_BEGIN, {scope: this});

            var res = $apply.apply(this, arguments);

            eventsSource.raise(APPLY_END, {scope: this});

            return res;
        }
    });

    hook(Scope.prototype, "$digest", function($digest) {
        return function() {
            iterationCount = 0;

            eventsSource.raise(DIGEST_BEGIN, {scope: this});

            var res = $digest.apply(this, arguments);

            eventsSource.raise(DIGEST_END, {scope: this, iterationCount: iterationCount});

            return res;
        }
    });

    hook(Scope.prototype, "$watch", function($watch) {
        return function() {
            iterationCount = 0;

            eventsSource.raise(WATCHER_ADDING, {scope: this});

            var off = $watch.apply(this, arguments);

            eventsSource.raise(WATCHER_ADDED, {scope: this});

            return function() {
                eventsSource.raise(WATCHER_REMOVE, {scope: this});

                return off();
            };
        }
    });
    
    $rootScope.$watch(function() {
        ++iterationCount;

        eventsSource.raise(ITERATION, {number: iterationCount});
    });
}

appModule.decorator("$http", ["$delegate", function($delegate) {
    hook($delegate, "get", function (get) {
        return function() {
            return get.apply(this, arguments);
        }
    });


    hook($delegate, "post", function (post) {
        return function() {
            console.log("http.post");

            return post.apply(this, arguments);
        }
    });

    // function http() {
    //     console.debug("http");
    //
    //     return $delegate.apply(this, arguments);
    // }
    //
    // Object.assign(http, $delegate);

    return $delegate;
}]);

appModule.run(["$rootScope", _$rootScope => {
    $rootScope = _$rootScope;

    initHooks();
}]);
