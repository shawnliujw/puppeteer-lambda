#!/usr/bin/env bash
apt-get update && apt install -y docker.io apt-transport-https curl&& systemctl enable docker
apt-get install -y jq

git clone https://github.com/shawnliujw/puppeteer-lambda.git
git checkout -b build remotes/origin/amazonlinux201803


cd ~/puppeteer-lambda/packages/chromium && sh docker-build.sh