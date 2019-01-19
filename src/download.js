const download = require('download');
const path = require('path');
const config = require('./config');

module.exports = () => {
    console.log('downloading chrome ...');
    return download( config.headlessFilePath, path.join(__dirname, '../chrome')).then(() => {
        console.log('done!');
    });
}