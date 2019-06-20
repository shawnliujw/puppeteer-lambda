/**
 * Created by shawn-liu on 18/1/21.
 */

const Promise = require('bluebird');
const expect = require('chai').expect;
const puppeteer = require('../../src/index');

describe('puppeteer setup test', () => {
    it('should get browser with custom_chrome=true ', async function () {

        const browser = await puppeteer.getBrowser({
            dumpio: false,
            headless: true
        });
        await browser.close();
        expect(browser).not.null;
    }).timeout(5000);

});