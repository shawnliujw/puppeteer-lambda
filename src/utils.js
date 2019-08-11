const config = require('./config');

exports.debugLog = (log) => {
    if (config.DEBUG) {
        let message = log;
        if (typeof log === 'function') message = log();
        Promise.resolve(message).then(
            (message) => console.log(message)
        );
    }
};
