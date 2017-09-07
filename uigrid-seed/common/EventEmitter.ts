import {ILogger, NullLogger} from "./Logger";

export class EventEmitterSource {
    private name: string;
    private events: any;

    constructor() {
        this.events = {};
    }

    raise(name: string, args: any, logger: ILogger = new NullLogger()) {
        logger.log("BEGIN raise", name, "with", args);

        var before = new Date();

        var handlers: EventHandler[] = this.events[name];
        if(!handlers) {
            return;
        }

        handlers.forEach(handler => {
            handler.method.call(handler.obj, args);
        });

        var after = new Date();

        logger.log("END raise", name, " AFTER " + (after.valueOf() - before.valueOf()) + "ms");
    }

    subscribe(name: string, method: Function)
    subscribe(name: string, obj: any, method: Function)
    subscribe(name: string, obj: any, method?: Function) {
        if(method == undefined) {
            //
            //  Caller sent only a method without an object
            //
            method = obj;
            obj = null;
        }

        var handlers: EventHandler[] = this.events[name];
        if(!handlers) {
            handlers = this.events[name] = [];
        }

        handlers.push({
            obj: obj,
            method: method,
        });
    }

    unsubscribeAll(obj: any) {
        for(let key in this.events) {
            let handlers = this.events[key];

            for(let i=0; i<handlers.length; i++) {
                let handler = handlers[i];

                if(handler.obj==obj) {
                    handlers.splice(i, 1);
                    --i;
                }
            }
        }
    }

    unsubscribe(name: string, method: Function)
    unsubscribe(name: string, obj: any, method: Function)
    unsubscribe(name: string, obj: any, method?: Function) {
        if(method == undefined) {
            //
            //  Caller sent only a method without an object
            //
            method = obj;
            obj = null;
        }

        var handlers: EventHandler[] = this.events[name];
        if(!handlers) {
            return;
        }

        let index = -1;
        for(var i=0; i<handlers.length; i++) {
            let handler = handlers[i];

            if(handler.obj ==obj && handler.method==method) {
                index = i;
                break;
            }
        }

        if(index != -1) {
            handlers.splice(index, 1);
        }
    }
}

export class EventEmitter {
    private event: EventEmitterSource;

    constructor(event: EventEmitterSource) {
        this.event = event;
    }

    subscribe(name: string, method: Function)
    subscribe(name: string, obj: any, method: Function)
    subscribe(name: string, obj: any, method?: Function) {
        this.event.subscribe(name, obj, method);
    }

    unsubscribe(name: string, method: Function)
    unsubscribe(name: string, obj: any, method: Function)
    unsubscribe(name: string, obj: any, method?: Function) {
        this.event.unsubscribe(name, obj, method);
    }
}

interface EventHandler {
    obj: any;
    method: Function;
}


