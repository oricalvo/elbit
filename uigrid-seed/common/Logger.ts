export interface ILogger {
    log(message, ... args: any[]);
    info(message, ... args: any[]);
    error(message, ... args: any[]);
    create(prefix): ILogger;
}

var disabled = [
    "ThriftService",
];

export function createLogger(prefix: string) : ILogger {
    if(isDisabled(prefix)) {
        return new NullLogger();
    }

    var logger = console.log.bind(console, prefix);

    logger.prefix = prefix;
    logger.log = logger;
    logger.error = console.error.bind(console, prefix);
    logger.info = console.info.bind(console, prefix);
    logger.create = function(prefix) {
        return createLogger(logger.prefix+prefix);
    }

    return logger;
}

function isDisabled(name) {
    var res = disabled.indexOf(name) != -1;
    return res;
}

export class NullLogger implements ILogger {
    log(message, ... args: any[]) {
    }

    info(message, ... args: any[]) {
    }

    error(message, ... args: any[]) {
    }

    create() {
        return this;
    }
}
