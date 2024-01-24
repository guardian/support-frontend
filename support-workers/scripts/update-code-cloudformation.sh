#!/bin/bash

./build-cloudformation.sh

aws --region eu-west-1 cloudformation validate-template --template-body file://../cloud-formation/target/cfn.yaml --profile membership

aws --region eu-west-1 --profile membership \
  cloudformation update-stack \
  --capabilities CAPABILITY_IAM  \
  --stack-name support-CODE-workers \
  --template-body file://../cloud-formation/target/cfn.yaml \
  --parameters  ParameterKey=Stage,ParameterValue=CODE ParameterKey=OphanRole,UsePreviousValue=true ParameterKey=KinesisStreamArn,UsePreviousValue=true

if [[ $? == 0 ]]; then
  echo -e "\nStack update has been started, check progress in the AWS console.";
  exit 0;
fi
