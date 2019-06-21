#!/usr/bin/env bash
rm -rf dist && mkdir -p dist
rm -rf binary && mkdir -p binary
cp scripts/build.sh dist/
cp scripts/latest.sh dist/
cp amazonlinux201803/Dockerfile dist/Dockerfile

export CHROMIUM_VERSION=$(./latest.sh stable)

docker build \
  -v binary:build/chromium/src/out/Headless/
  -t "headless-chromium:$CHROMIUM_VERSION" \
  --build-arg VERSION="$CHROMIUM_VERSION" \
  "dist"

