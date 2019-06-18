/**
 * Created by shawn-liu on 18/1/21.
 */
const puppeteer = require('../../src/index');
const Promise = require('bluebird');
// describe('puppeteer setup test', () => {
//     it('should get browser', () => {
(async () => {
    try {
        const browser = await puppeteer.getBrowser({
            dumpio: false,
            headless: false
        });
        const page = await browser.newPage();
        await page.goto('https://www.baidu.com');
        await page.screenshot({path: 'example.png'});
        await Promise.delay(2000)
        await browser.close();
    }catch (e) {
        console.error(e)
    }

})();
//     });
// });