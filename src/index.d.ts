import { Browser, LaunchOptions } from 'puppeteer';
export declare function getBrowser(options?: LaunchOptions): Promise<Browser>;
export declare function existsLocalChrome(): Promise<any>;
export declare function existsExecutableChrome(): Promise<any>;
