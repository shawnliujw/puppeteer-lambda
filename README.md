# Puppeteer Lambda

Module for using Headless-Chrome by [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda.  
Idea from [Puppeteer Lambda Starter Kit](https://github.com/sambaiz/puppeteer-lambda-starter-kit) , thanks [Taiki Sakamoto](https://github.com/sambaiz)
## How to use

`npm install puppeteer-lambda or yarn add puppeteer-lambda`

```javascript
(async () => {
    const puppeteerLambda = require('puppeteer-lambda');
    const browser = await puppeteerLambda.getBrowser({
    headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});

    await browser.close(); 
})();
```

## Packaging & Deploy

Lambda's memory needs to be set to at least 384 MB, but the more memory, the better the performance of any operations.

```
512MB -> goto(youtube): 6.481s
1536MB -> goto(youtube): 2.154s
```

### chrome in package (recommended)

run `npm install or yarn` in the project which import `puppeteer-lambda`, default it will download the build chrome and you can use it directly

### chrome NOT in package

Due to the large size of Chrome, it may exceed the [Lambda package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) (50MB) depending on the other module to include. 
In that case, put Chrome in S3 and download it at container startup so startup time will be longer.

Run `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install`, deploy the package.zip, and set following env valiables on Lambda.

- `CHROME_BUCKET`(required): S3 bucket where Chrome is put
- `CHROME_KEY`(optional): S3 key. default: `headless_shell.tar.gz`

