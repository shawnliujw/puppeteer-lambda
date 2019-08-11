#!/usr/bin/env bash
sh scripts/prepare-build.sh
cp .dockerignore build/
cp lambda_env/node8.1/Dockerfile build/Dockerfile && cd build/

docker build -t  shawnliu/puppeteer-lambda:node8.1  .

docker run --rm  -it \
-v "$PWD/src":/var/task/src \
-v "$PWD/test":/var/task/test \
-e DEBUG=true \
shawnliu/puppeteer-lambda:node8.1
