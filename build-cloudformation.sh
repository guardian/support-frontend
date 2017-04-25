#!/bin/bash

cd cloud-formation

[ -d target ] && rm -rf target

mkdir target

./compile.py > target/cfn.yaml
