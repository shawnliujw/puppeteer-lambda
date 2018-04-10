const fs = require('fs');

var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

(() => {
    // here will remove the folder chrome when found process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true;
    if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD) {
        deleteFolderRecursive('../chrome');
    }
})();