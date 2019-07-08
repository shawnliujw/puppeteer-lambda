# Puppeteer Lambda

Module for using Headless-Chrome by [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda.  
Idea from [Puppeteer Lambda Starter Kit](https://github.com/sambaiz/puppeteer-lambda-starter-kit) , thanks [Taiki Sakamoto](https://github.com/sambaiz)
## How to use

`npm install puppeteer-lambda`  
add `--registry=https://registry.npm.taobao.org/` if you can't download the chromnium in China

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
NOTE: `Suggest not to close browser in Lambda ENV, if close it , the Browser object is considered disposed and cannot be used anymore.`
## Packaging & Deploy

Lambda's memory needs to be set to at least 384 MB, but the more memory, the better the performance of any operations.

```
512MB -> goto(youtube): 6.481s
1536MB -> goto(youtube): 2.154s
```

You should also set a environment variable in lambda:

```
CUSTOM_CHROME = true
```

NOTE: This project uses `puppeteer` so don't forget to set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` before run `npm install` when you prepare the **package for lambda**.

### 1.chrome in package (recommended)

run `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true CUSTOM_CHROME=true npm install puppeteer-lambda` ,then deploy the package to lambda and set the following env variables in lambda.

- `CUSTOM_CHROME`(required): tell the progress to use the custom chrome(locale version or download from s3 automatically)

 `node_modules/puppeteer-lambda` should like:
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
In that case, put [Chrome Binary](https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-55/stable-headless-chromium-amazonlinux-2017-03.zip) in S3 and download it at container startup so startup time will be longer.  
You can also download the specific version of chrome from [Serverless Chrome](https://github.com/adieuadieu/serverless-chrome/releases)

Run `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer-lambda`, deploy the package , and set following env valiables on Lambda.

- `CHROME_BUCKET`(required): S3 bucket where Chrome is put
- `CHROME_KEY`(optional): S3 key. default: `headless_shell.tar.gz`  

## How to Test  
### 1. run test from your localhost  
run `npm run test`  
### 2 run in aws lambda simulation environment  
test nodejs 8.10 `npm run test-node8`  
test nodejs 10.x  `npm run test-node10` 

## Q&A  
### Why not use `puppeteer-core`?  
In development mode ,we still need chromnium for debugging , so better to `puppeteer` which will install chromnium automatically  

### How do we use `puppeteer-lambda` with TypeScript?
`puppeteer-lambda` type definitions depends on `@types/puppeteer` definition.
You must add `@types/puppeteer` in your project.

`npm install @types/puppeteer` . 
### AWS Lambda Version . 
now the prebuilt chromium [v1.0.0-55](https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-55/stable-headless-chromium-amazonlinux-2017-03.zip)  **doesn't support AWS Lambda Nodejs version 10.x** , if please use nodejs8.10 , if u prefer to use node10.x , please follow the [instruction](https://github.com/adieuadieu/serverless-chrome#building-headless-chromechromium) to build your own chromium and modify the configuration [here](https://github.com/shawnliujw/puppeteer-lambda/blob/5b87c7089defdfb3207df6521b48f648810ed3ef/src/config.js#L14)
**NOTE**: also please have a look this [issue](https://github.com/adieuadieu/serverless-chrome/issues/203) , seems lambda is changing their lambda environment, i tried built from amazonlinux 2 which is the base image for nodejs10x , but it still can not fund from lambda:nodejs10.x .
