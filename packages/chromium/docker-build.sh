#!/usr/bin/env bash
rm -rf dist && mkdir -p dist/

docker run -d -v dist/:/build amazonlinux:2 bash