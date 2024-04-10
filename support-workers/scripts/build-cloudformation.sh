#!/bin/bash
set -xe

base=`dirname -- "$0"`

cd ${base}/../cloud-formation

[ -d target ] && rm -rf target

mkdir target

cd src
rm -rf node_modules
yarn install

GITHUB_RUN_NUMBER=$1 yarn run build-cfn
