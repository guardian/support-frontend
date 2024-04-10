#!/bin/bash
set -xe

base=`dirname -- "$0"`

${base}/build-cloudformation.sh $1

aws --region eu-west-1 --profile membership \
  s3 cp ${base}/../cloud-formation/target/cfn.yaml s3://support-workers-dist/support/CODE/cloudformation/

aws --region eu-west-1 --profile membership \
  cloudformation validate-template --template-url https://s3.amazonaws.com/support-workers-dist/support/CODE/cloudformation/cfn.yaml
  # --template-body file://../cloud-formation/target/cfn.yaml

aws --region eu-west-1 --profile membership \
  cloudformation update-stack \
  --capabilities CAPABILITY_IAM  \
  --stack-name support-CODE-workers \
  --parameters  ParameterKey=Stage,ParameterValue=CODE ParameterKey=OphanRole,UsePreviousValue=true ParameterKey=KinesisStreamArn,UsePreviousValue=true \
  --template-url https://s3.amazonaws.com/support-workers-dist/support/CODE/cloudformation/cfn.yaml
  # --template-body file://../cloud-formation/target/cfn.yaml

aws --region eu-west-1 --profile membership \
  s3 rm s3://support-workers-dist/support/CODE/cloudformation/cfn.yaml

if [[ $? == 0 ]]; then
  echo -e "\nStack update has been started, check progress in the AWS console.";
  exit 0;
fi
