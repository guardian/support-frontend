#!/bin/bash

aws --region eu-west-1 cloudformation validate-template --template-body file://cfn.yaml --profile membership

if [[ $? == 0 ]]; then
  echo -e "\nYour CloudFormation template is valid.";
  exit 0;
fi
