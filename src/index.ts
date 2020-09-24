import * as aws from 'aws-sdk';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as unzip from 'unzipper';
import { Browser, launch } from 'puppeteer-core';
import { debugLog } from './utils';
import { getPuppeteerConfig, PuppeteerConfig } from './config';
import { LaunchOptions } from 'puppeteer';

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

export class LambdaPuppeteer {
  private static instance: LambdaPuppeteer;
  private readonly config: PuppeteerConfig;
  private globalBrowser: Browser | null;
  private getting = false;

  private constructor(config: PuppeteerConfig) {
    this.config = config;
  }

  static getInstance(): LambdaPuppeteer {
    if (!this.instance) {
      this.instance = new LambdaPuppeteer(getPuppeteerConfig());
    }
    return this.instance;
  }

  public async getBrowser(options: LaunchOptions) {
    if (null !== this.globalBrowser && (await this.isBrowserAvailable())) {
      return this.globalBrowser;
    }
    if (null === this.globalBrowser && !this.getting) {
      this.getting = true;
      const useLocal = process.env.CUSTOM_CHROME && process.env.CUSTOM_CHROME == 'true';
      if (useLocal || (process.env.CHROME_BUCKET && process.env.CHROME_KEY)) {
        await this.setupChrome(useLocal);
        this.globalBrowser = await launch(
          Object.assign(
            {
              headless: true,
              executablePath: this.config.executablePath,
              args: this.config.launchOptionForLambda,
              dumpio: !!this.config.DEBUG,
              ignoreHTTPSErrors: true
            },
            options
          )
        );
      } else {
        this.globalBrowser = await launch(
          Object.assign(
            {
              dumpio: !!this.config.DEBUG,
              ignoreHTTPSErrors: true
            },
            options
          )
        );
      }

      const version = await this.globalBrowser.version();
      debugLog(`Launch chrome: ${version}`);
      this.getting = false;
      this.globalBrowser.on('disconnected', () => {
        this.globalBrowser = null;
        console.warn(
          '*****Suggest not to close browser in Lambda ENV, if close it , the Browser object is considered disposed and cannot be used anymore.****'
        );
      });
      return this.globalBrowser;
      // debugLog(async (b) => `launch done: ${await globalBrowser.version()}`);
    } else {
      do {
        await Bluebird.delay(50);
      } while (!this.globalBrowser);
      this.getting = false;
      return this.globalBrowser;
    }
  }

  public async existsLocalChrome() {
    return new Bluebird((resolve) => {
      fs.exists(this.config.localChromePath, (exists) => {
        resolve(exists);
      });
    });
  }

  public async existsExecutableChrome() {
    return new Bluebird((resolve) => {
      fs.access(this.config.executablePath, fs.constants.F_OK, (err) => {
        if (err) {
          debugLog(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  private async isBrowserAvailable() {
    try {
      //console.time('version')
      const version = await this.globalBrowser?.version();
      debugLog(`current browser version: ${version}`);
      //console.timeEnd('version')
    } catch (e) {
      this.globalBrowser = null;
      debugLog(e); // not opened etc.
      //console.log('browser is unavilable now, will re-create it.')
      return false;
    }
    return true;
  }

  private async setupChrome(useLocal) {
    if (!(await this.existsExecutableChrome())) {
      if (useLocal && (await this.existsLocalChrome())) {
        debugLog('setup local chrome');
        await this.setupLocalChrome();
      } else {
        debugLog('setup s3 chrome');
        await this.setupS3Chrome();
      }
      debugLog('setup done');
    }
  }

  private async setupLocalChrome() {
    return new Bluebird((resolve, reject) => {
      fs.createReadStream(this.config.localChromePath)
        .on('error', (err) => reject(err))
        .pipe(
          unzip
            .Extract({
              path: this.config.setupChromePath
            })
            .on('close', () => {
              fs.chmodSync(this.config.setupChromePath + '/' + this.config.headlessExecutable, 0o755);
              resolve();
            })
            .on('error', (err) => reject(err))
        );
    });
  }

  private async setupS3Chrome() {
    return new Bluebird((resolve, reject) => {
      if (!this.config.remoteChromeS3Bucket || !this.config.remoteChromeS3Key) {
        throw new Error('both remoteChromeS3Bucket and remoteChromeS3Key are required');
      }
      const params = {
        Bucket: this.config.remoteChromeS3Bucket,
        Key: this.config.remoteChromeS3Key
      };
      s3.getObject(params)
        .createReadStream()
        .on('error', (err) => reject(err))
        .pipe(
          unzip
            .Extract({
              path: this.config.setupChromePath
            })
            .on('close', () => {
              fs.chmodSync(this.config.setupChromePath + '/' + this.config.headlessExecutable, 0o755);
              resolve();
            })
            .on('error', (err) => reject(err))
        );
    });
  }
}
