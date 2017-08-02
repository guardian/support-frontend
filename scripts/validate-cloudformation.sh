#!/bin/bash

./build-cloudformation.sh

aws --region eu-west-1 cloudformation validate-template --template-body file://../cloud-formation/target/cfn.yaml --profile membership
