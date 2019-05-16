const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const fs = require('fs');
const unzip = require('unzipper');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const config = require('./config');

let globalBrowser = null;
let getting = false;
exports.getBrowser = async (options) => {
    if (null !== globalBrowser && await isBrowserAvailable()) {
        return globalBrowser;
    }
    if (null === globalBrowser && !getting) {
        getting = true;
        if ((process.env.CUSTOM_CHROME && process.env.CUSTOM_CHROME == "true" )|| (process.env.CHROME_BUCKET && process.env.CHROME_KEY)) {
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
        getting = false;
        globalBrowser.on('disconnected',() => {
            globalBrowser = null;
            console.log('******************************************************************************************************************************  ')
            console.log('Suggest not to close browser in Lambda ENV, if close it , the Browser object is considered disposed and cannot be used anymore. ')
            console.log('******************************************************************************************************************************  ')
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
    console.log('checking')
    try {
       //console.time('version')
       const version = await globalBrowser.version();
       console.log(`current browser version: ${version}`)
       //console.timeEnd('version')
    } catch (e) {
        globalBrowser = null;
        debugLog(e); // not opened etc.
        //console.log('browser is unavilable now, will re-create it.')
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

const debugLog = (log) => {
    if (config.DEBUG) {
        let message = log;
        if (typeof log === 'function') message = log();
        Promise.resolve(message).then(
            (message) => console.log(message)
        );
    }
};
