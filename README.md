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

NOTE: And this project use `puppeteer` so don't forget to set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` before run `npm install or yarn` when you prepare the package for lambda.

### 1.chrome in package (recommended)

run `CUSTOM_CHROME=true npm install puppeteer-lambda or CUSTOM_CHROME=true yarn add puppeteer-lambda` ,then deploy the package, and set the following env variables in lambda.

- `CUSTOM_CHROME`(required): tell the progress to use the custom chrome(locale version or download from s3 automatically)

`PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true CUSTOM_CHROME=true yarn add puppeteer-lambda`  
then please check the `node_modules/puppeteer-lambda`
```
puppeteer-lambda
│   README.md
│   ...    
│
└───chrome
│   │   headless_shell.tar.gz
│   
└───node_modules
    │   ...
│   
└───src
    │   ...
│   
└───test
    │   ...
    
```

### 2.chrome NOT in package

Due to the large size of Chrome, it may exceed the [Lambda package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) (50MB) depending on the other module to include. 
In that case, put [Chrome Binary](https://raw.githubusercontent.com/shawnLiujianwei/puppeteer-lambda-binary/master/chrome/headless_shell.tar.gz) in S3 and download it at container startup so startup time will be longer.  
You can also download the specific version of chrome from [Serverless Chrome](https://github.com/adieuadieu/serverless-chrome/releases)

Run `npm install puppeteer-lambda or yarn add puppeteer-lambda`, deploy the package , and set following env valiables on Lambda.

- `CHROME_BUCKET`(required): S3 bucket where Chrome is put
- `CHROME_KEY`(optional): S3 key. default: `headless_shell.tar.gz`

