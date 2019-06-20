#!/usr/bin/env bash

rm -rf build && mkdir -p build
cp -r  src  build/src
cp -r  test build/test
cp package* build/