/**
 * Created by shawn-liu on 2018/4/11.
 */
const download = require('./download');
const index = require('./index');
const fs = require('fs');
const path = require('path');

(async () => {
    if (process.env.CUSTOM_CHROME && process.env.CUSTOM_CHROME == "true") {
        if (!await index.existsLocalChrome() && !await index.existsExecutableChrome()) {
            download();
        } else {
            fs.mkdirSync(path.join(__dirname, '../chrome'));
            console.log('Local chrome file exist already, will ignore the download');
        }

    }

})();

