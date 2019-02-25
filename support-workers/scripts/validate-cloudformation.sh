#!/bin/bash

./build-cloudformation.sh

aws --region eu-west-1 cloudformation validate-template --template-body file://../cloud-formation/target/cfn.yaml --profile membership

if [[ $? == 0 ]]; then
  echo -e "\nYour CloudFormation template is valid.";
  exit 0;
fi
