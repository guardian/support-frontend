#!/bin/bash

cd ../cloud-formation

[ -d target ] && rm -rf target

mkdir target

cd src
rm -rg node_modules
yarn install

yarn run build-cfn
