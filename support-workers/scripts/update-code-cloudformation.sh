#!/bin/bash

cd ../..
pnpm --filter cdk synth

# We need to upload the template to S3 because it is too big to inline
aws --region eu-west-1 --profile membership \
  s3 cp ./cdk.out/SupportWorkers-CODE.template.json s3://support-workers-dist/support/CODE/cloudformation/

cd -

aws --region eu-west-1 --profile membership \
  cloudformation update-stack \
  --capabilities CAPABILITY_IAM  \
  --stack-name support-CODE-workers \
  --template-url https://s3.amazonaws.com/support-workers-dist/support/CODE/cloudformation/SupportWorkers-CODE.template.json

aws --region eu-west-1 --profile membership \
  s3 rm s3://support-workers-dist/support/CODE/cloudformation/SupportWorkers-CODE.template.json

if [[ $? == 0 ]]; then
  echo -e "\nStack update has been started, check progress in the AWS console.";
  exit 0;
fi
