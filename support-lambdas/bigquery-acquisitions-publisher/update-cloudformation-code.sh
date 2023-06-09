#!/bin/sh


cd ../../cdk

yarn synth

# Exit if any of these commands fail, print commands to console
set -ex

aws cloudformation update-stack \
  --capabilities '["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM", "CAPABILITY_IAM"]'  \
  --stack-name bigquery-acquisitions-publisher-CODE \
  --template-body file://cdk.out/BigqueryAcquisitionsPublisher-CODE.template.json \
  --parameters ParameterKey=AssetParameters6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50ArtifactHash304852AE,UsePreviousValue=true ParameterKey=AssetParameters6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50S3VersionKey6146B69E,UsePreviousValue=true ParameterKey=AssetParameters6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50S3Bucket41B151F4,UsePreviousValue=true \
  --profile membership

cd -
echo -e "\nStack update has been started, check progress in the AWS console.";
echo -e "https://eu-west-1.console.aws.amazon.com/cloudformation/home";
