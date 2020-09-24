import { join } from 'path';
import { getPuppeteerConfig } from './config';
import * as download from 'download';
import { debugLog } from './utils';

const config = getPuppeteerConfig();
export default () => {
  debugLog('downloading chrome ...');
  return download(config.headlessFilePath, join(__dirname, '../chrome')).then(() => {
    debugLog('download success!');
  });
};
