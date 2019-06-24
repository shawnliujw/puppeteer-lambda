#!/usr/bin/env bash

export CHROMIUM_VERSION=$(./latest.sh stable)
echo $CHROMIUM_VERSION

docker run -it -v $PWD/:/volume_chrome  -e VERSION=$CHROMIUM_VERSION   amazonlinux:2 bash