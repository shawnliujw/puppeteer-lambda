const download = require('download');
const path = require('path');
const config = require('./config');
const utils = require('./utils');

module.exports = () => {
    utils.debugLog('downloading chrome ...');
    return download(config.headlessFilePath, path.join(__dirname, '../chrome')).then(() => {
        utils.debugLog('download success!');
    });
}
