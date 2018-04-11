/**
 * Created by shawn-liu on 2018/4/11.
 */
const download = require('./download');

if (process.env.CUSTOM_CHROME) {
    download();
}