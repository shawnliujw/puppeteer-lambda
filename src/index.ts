import * as aws from 'aws-sdk';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import { existsSync, writeFileSync } from 'fs';
import { Browser, launch } from 'puppeteer-core';
import { debugLog } from './utils';
import { LaunchOptions } from 'puppeteer';
import { join } from 'path';
import * as download from 'download';
// @ts-ignore
import * as lambdafs from 'lambdafs';

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

export class PuppeteerConfig {
  launchOptionForLambda: string[];
  localChromePath: string;
  remoteChromePath: string;
  remoteChromeS3Bucket?: string;
  remoteChromeS3Key?: string;
  executablePath?: string;
  DEBUG: boolean;
}

export class LambdaPuppeteer {
  private static instance: LambdaPuppeteer;
  private readonly config: PuppeteerConfig;
  private globalBrowser: Browser | null;
  private pendingBrowserFetch: Promise<Browser> | null;

  private constructor() {
    this.config = {
      launchOptionForLambda: [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--disk-cache-size=33554432',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
        '--single-process'
      ],
      remoteChromePath: 'https://raw.githubusercontent.com/shawnliujw/puppeteer-lambda/puppeteer-5.x/binary/chromium.br',
      localChromePath: join(__dirname, '../binary/chromium.br'),
      remoteChromeS3Bucket: process.env.CHROME_BUCKET,
      remoteChromeS3Key: process.env.CHROME_KEY,
      DEBUG: !!process.env.DEBUG
    };
  }

  static getInstance(): LambdaPuppeteer {
    if (!this.instance) {
      this.instance = new LambdaPuppeteer();
    }
    return this.instance;
  }

  public async getBrowser(options: LaunchOptions) {
    if (null !== this.globalBrowser && (await this.isBrowserAvailable())) {
      return this.globalBrowser;
    }
    if (this.pendingBrowserFetch) {
      return this.pendingBrowserFetch;
    }
    await this.setupChrome();
    this.pendingBrowserFetch = launch(
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
    )
      .then(async (browser) => {
        const version = await browser.version();
        debugLog(`Launch chrome: ${version}`);
        this.globalBrowser = browser;
        this.globalBrowser.on('disconnected', () => {
          this.globalBrowser = null;
          console.warn(
            '*****Suggest not to close browser in Lambda ENV, if close it , the Browser object is considered disposed and cannot be used anymore.****'
          );
        });
        return this.globalBrowser;
      })
      .finally(() => {
        this.pendingBrowserFetch = null;
      });
    return this.pendingBrowserFetch;
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

  private async setupChrome() {
    if (this.config.executablePath) {
      return;
    }
    if (!existsSync(this.config.localChromePath)) {
      if (this.config.remoteChromeS3Bucket || this.config.remoteChromeS3Key) {
        await this.setupS3Chrome();
      } else {
        writeFileSync(this.config.localChromePath, await download(this.config.remoteChromePath));
      }
    }

    const promises = [lambdafs.inflate(this.config.localChromePath), lambdafs.inflate(join(__dirname, './lib/swiftshader.tar.br'))];

    // @ts-ignore
    if (['AWS_Lambda_nodejs10.x', 'AWS_Lambda_nodejs12.x'].includes(process.env.AWS_EXECUTION_ENV) === true) {
      promises.push(lambdafs.inflate(join(__dirname, './lib/aws.tar.br')));
    }

    this.config.executablePath = (await Bluebird.all(promises)).shift();
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
      const writeStream = fs.createWriteStream(this.config.localChromePath);
      writeStream.on('close', () => {
        resolve();
      });
      s3.getObject(params)
        .createReadStream()
        .on('error', (err) => reject(err))
        .pipe(writeStream);
    });
  }
}
