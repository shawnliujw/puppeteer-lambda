/**
 * Created by shawn-liu on 2018/4/11.
 */
import download from './download';
import { mkdirSync } from 'fs';
import { debugLog } from './utils';
import { join } from 'path';
import { LambdaPuppeteer } from './index';

const puppeteerInstance = LambdaPuppeteer.getInstance();

(async () => {
  if (process.env.CUSTOM_CHROME && process.env.CUSTOM_CHROME == 'true') {
    if (!(await puppeteerInstance.existsLocalChrome()) && !(await puppeteerInstance.existsExecutableChrome())) {
      download();
    } else {
      mkdirSync(join(__dirname, '../chrome'));
      debugLog('Local chrome file exist already, will ignore the download');
    }
  }
})();
