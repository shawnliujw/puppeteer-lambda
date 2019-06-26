FROM    lambci/lambda:nodejs10.x
USER    root
RUN     mkdir /dist
ENV     PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV     CUSTOM_CHROME=true
ENV     HEADLESS_CHROME_FILE=/chrome/headless_shell
COPY    package.json /dist
COPY    package-lock.json* /dist
RUN     cd /dist && npm install -d --registry=https://registry.npm.taobao.org/ && cp -r /dist/node_modules /var/task/node_modules

COPY    src/ /dist/src/
RUN     cd /dist/src && ls -l && node ./install.js && cp -r /dist/chrome /var/task/chrome
COPY    package.json /var/task/package.json

ENTRYPOINT bash
