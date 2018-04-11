const download = require('download');
const path = require('path');

module.exports = () => {
    console.log('downloading chrome ...');
    return download('https://raw.githubusercontent.com/shawnLiujianwei/puppeteer-lambda-binary/master/chrome/headless_shell.tar.gz', path.join(__dirname, '../chrome')).then(() => {
        console.log('done!');
    });
}