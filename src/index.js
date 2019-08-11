const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const fs = require('fs');
const unzip = require('unzipper');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const config = require('./config');
const utils = require('./utils');

let globalBrowser = null;
let getting = false;

exports.getBrowser = async (options) => {
    if (null !== globalBrowser && await isBrowserAvailable()) {
        return globalBrowser;
    }
    if (null === globalBrowser && !getting) {
        getting = true;
        const useLocal = process.env.CUSTOM_CHROME && process.env.CUSTOM_CHROME == "true";
        if (useLocal || (process.env.CHROME_BUCKET && process.env.CHROME_KEY)) {
            await setupChrome(useLocal);
            globalBrowser = await puppeteer.launch(Object.assign({
                headless: true,
                executablePath: config.executablePath,
                args: config.launchOptionForLambda,
                dumpio: !!config.DEBUG,
                ignoreHTTPSErrors: true
            }, options));
        } else {
            globalBrowser = await puppeteer.launch(Object.assign({
                dumpio: !!config.DEBUG,
                ignoreHTTPSErrors: true
            }, options));
        }

        const version = await globalBrowser.version();
        utils.debugLog(`Launch chrome: ${version}`);
        getting = false;
        globalBrowser.on('disconnected', () => {
            globalBrowser = null;
            console.warn('*****Suggest not to close browser in Lambda ENV, if close it , the Browser object is considered disposed and cannot be used anymore.****')
        });
        return globalBrowser;
        // debugLog(async (b) => `launch done: ${await globalBrowser.version()}`);
    } else {
        do {
            await Promise.delay(50);
        } while (!globalBrowser);
        getting = false;
        return globalBrowser;
    }
}


const isBrowserAvailable = async () => {
    try {
        //console.time('version')
        const version = await globalBrowser.version();
        utils.debugLog(`current browser version: ${version}`)
        //console.timeEnd('version')
    } catch (e) {
        globalBrowser = null;
        utils.debugLog(e); // not opened etc.
        //console.log('browser is unavilable now, will re-create it.')
        return false;
    }
    return true;
};

const setupChrome = async (useLocal) => {
    if (!await existsExecutableChrome()) {
        if (useLocal && await existsLocalChrome()) {
            utils.debugLog('setup local chrome');
            await setupLocalChrome();
        } else {
            utils.debugLog('setup s3 chrome');
            await setupS3Chrome();
        }
        utils.debugLog('setup done');
    }
};

const existsLocalChrome = () => {
    return new Promise((resolve, reject) => {
        fs.exists(config.localChromePath, (exists) => {
            resolve(exists);
        });
    });
};

exports.existsLocalChrome = existsLocalChrome;

const existsExecutableChrome = () => {
    return new Promise((resolve, reject) => {
        fs.access(config.executablePath, fs.constants.F_OK, (err) => {
            if (err) {
                utils.debugLog(err);
                resolve(false);
            } else {
                resolve(true)
            }
        });
    });
};

exports.existsExecutableChrome = existsExecutableChrome;

const setupLocalChrome = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(config.localChromePath)
            .on('error', (err) => reject(err))
            .pipe(unzip.Extract({
                path: config.setupChromePath,
            }).on('close', () => {
                fs.chmodSync(config.setupChromePath + '/' + config.headlessExecutable, 0o755);
                resolve()
            }).on('error', (err) => reject(err)))
    });
};

const setupS3Chrome = () => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: config.remoteChromeS3Bucket,
            Key: config.remoteChromeS3Key,
        };
        s3.getObject(params)
            .createReadStream()
            .on('error', (err) => reject(err))
            .pipe(unzip.Extract({
                path: config.setupChromePath,
            }).on('close', () => {
                fs.chmodSync(config.setupChromePath + '/' + config.headlessExecutable, 0o755);
                resolve()
            }).on('error', (err) => reject(err)))
    });
};

