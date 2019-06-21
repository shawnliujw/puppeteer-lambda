#!/usr/bin/env bash
rm -rf dist && mkdir -p dist

export CHROMIUM_VERSION=$(latest.sh stable)
echo $CHROMIUM_VERSION

echo "building image..."
docker build -t headless-chromium:$CHROMIUM_VERSION --build-arg VERSION="$CHROMIUM_VERSION" .
echo "extracting shell from image..."


docker run --rm --entrypoint /bin/sh headless-chromium:$CHROMIUM_VERSION -c "cat build/chromium/src/out/Headless/headless_shell" > dist/headless_shell