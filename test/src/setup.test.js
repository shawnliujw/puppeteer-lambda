/**
 * Created by shawn-liu on 18/1/21.
 */
const puppeteer = require('../../src/index');

// describe('puppeteer setup test', () => {
//     it('should get browser', () => {
        (async () => {
            const browser = await puppeteer.getBrowser({
                dumpio: true,
                headless: false
            });
            const page = await browser.newPage();
            await page.goto('https://www.google.com');
            await page.screenshot({path: 'example.png'});

            await browser.close();
        })();
//     });
// });