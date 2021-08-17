import { join, sep } from 'path';

const launchOptionForLambda = [
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
];

const headlessFile = 'chromium.br';
const headlessExecutable = 'headless-chromium';
const headlessFilePath = 'https://raw.githubusercontent.com/shawnliujw/puppeteer-lambda/puppeteer-5.x/binary/chromium.br';
const localChromePath = join(__dirname, '../chrome/' + headlessFile);
const remoteChromeS3Bucket = process.env.CHROME_BUCKET;
const remoteChromeS3Key = process.env.CHROME_KEY || headlessFile;

const setupChromePath = join(sep, 'tmp');
const executablePath = process.env.HEADLESS_CHROME_FILE || join(setupChromePath, headlessExecutable);

export class PuppeteerConfig {
  launchOptionForLambda: string[];
  localChromePath: string;
  headlessFilePath: string;
  remoteChromeS3Bucket?: string;
  remoteChromeS3Key?: string;
  setupChromePath: string;
  executablePath: string;
  headlessExecutable: string;
  DEBUG: boolean;
}

export const getPuppeteerConfig = (): PuppeteerConfig => {
  return {
    launchOptionForLambda,
    localChromePath,
    headlessFilePath,
    remoteChromeS3Bucket,
    remoteChromeS3Key,
    setupChromePath,
    executablePath,
    headlessExecutable,
    DEBUG: !!process.env.DEBUG
  };
};
