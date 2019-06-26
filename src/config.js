const path = require('path');

const launchOptionForLambda = [
    // error when launch(); No usable sandbox! Update your kernel
    '--no-sandbox',
    // error when launch(); Failed to load libosmesa.so
    '--disable-gpu',
    // freeze when newPage()
    '--single-process',
];

const headlessFile = "stable-headless-chromium-amazonlinux-2017-03.zip";
const headlessExecutable = "headless-chromium";
const headlessFilePath = "https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-55/stable-headless-chromium-amazonlinux-2017-03.zip";
const localChromePath = path.join(__dirname, '../chrome/' + headlessFile);
const remoteChromeS3Bucket = process.env.CHROME_BUCKET;
const remoteChromeS3Key = process.env.CHROME_KEY || headlessFile;

const setupChromePath = path.join(path.sep, 'tmp');
const executablePath = process.env.HEADLESS_CHROME_FILE || path.join(
    setupChromePath,
    headlessExecutable
);

const DEBUG = process.env.DEBUG;

module.exports = {
    launchOptionForLambda,
    localChromePath,
    headlessFilePath,
    remoteChromeS3Bucket,
    remoteChromeS3Key,
    setupChromePath,
    executablePath,
    headlessExecutable,
    DEBUG,
};
