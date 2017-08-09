#!/bin/bash

cd ../cloud-formation

[ -d target ] && rm -rf target

mkdir target

cd src-mustache

yarn run build-cfn
