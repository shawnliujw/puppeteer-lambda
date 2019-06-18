FROM    lambci/lambda:build-nodejs10.x
WORKDIR /var/task
RUN     mkdir /build
COPY    package.json /build
COPY    package-lock.json* /build
COPY    src/install.js /build
ENV     PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV     CUSTOM_CHROME=true
RUN     cd /build && npm install --production -d && cp -r /build/node_modules /var/task/node_modules
COPY    src/install.js /build/src/install.js
COPY    src/download.js /build/src/download.js
COPY    src/config.js /build/src/config.js

RUN     cd /build && npm run install && cp -r chrome/  /var/task/chrome