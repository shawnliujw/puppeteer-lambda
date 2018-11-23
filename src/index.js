const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const fs = require('fs');
const tar = require('tar');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const config = require('./config');

let globalBrowser = null;
let getting = false;
const _getBrowser = async (options) => {
    if (null !== globalBrowser && await isBrowserAvailable()) {
        return globalBrowser;
    }
    if (null === globalBrowser && !getting) {
        getting = true;
        if (process.env.CUSTOM_CHROME || (process.env.CHROME_BUCKET && process.env.CHROME_KEY)) {
            await setupChrome();
            globalBrowser = await puppeteer.launch(Object.assign({
                headless: true,
                executablePath: config.executablePath,
                args: config.launchOptionForLambda,
                dumpio: !!exports.DEBUG,
                ignoreHTTPSErrors: true
            }, options));
        } else {
            globalBrowser = await puppeteer.launch(Object.assign({
                dumpio: !!exports.DEBUG,
                ignoreHTTPSErrors: true
            }, options));
        }

        const version = await globalBrowser.version();
        console.log(`Launch chrome: ${version}`);
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

exports.getBrowser = async options => {
    await _getBrowser(options);
    return globalBrowser;
};

const isBrowserAvailable = async () => {
    try {
        await globalBrowser.version();
    } catch (e) {
        globalBrowser = null;
        debugLog(e); // not opened etc.
        return false;
    }
    return true;
};

const setupChrome = async () => {
    if (!await existsExecutableChrome()) {
        if (await existsLocalChrome()) {
            debugLog('setup local chrome');
            await setupLocalChrome();
        } else {
            debugLog('setup s3 chrome');
            await setupS3Chrome();
        }
        debugLog('setup done');
    }
};

const existsLocalChrome = () => {
    return new Promise((resolve, reject) => {
        fs.exists(config.localChromePath, (exists) => {
            resolve(exists);
        });
    });
};

const existsExecutableChrome = () => {
    return new Promise((resolve, reject) => {
        fs.exists(config.executablePath, (exists) => {
            resolve(exists);
        });
    });
};

const setupLocalChrome = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(config.localChromePath)
            .on('error', (err) => reject(err))
            .pipe(tar.x({
                C: config.setupChromePath,
            }))
            .on('error', (err) => reject(err))
            .on('end', () => resolve());
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
            .pipe(tar.x({
                C: config.setupChromePath,
            }))
            .on('error', (err) => reject(err))
            .on('end', () => resolve());
    });
};

const debugLog = (log) => {
    if (config.DEBUG) {
        let message = log;
        if (typeof log === 'function') message = log();
        Promise.resolve(message).then(
            (message) => console.log(message)
        );
    }
};
