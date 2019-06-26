#!/usr/bin/env bash

rm -rf build && mkdir -p build
cp -r  src  build/src
cp -r  test build/test

CHROME=chrome/

if [ -d "$CHROME" ]; then
    cp -r $CHROME  build/chrome
fi

cp package*.json build/