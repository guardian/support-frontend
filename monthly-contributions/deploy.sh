#!/usr/bin/env bash
sbt assembly
aws s3 cp monthly-contributions/target/scala-2.11/guardian-support-monthly-contributions-lambdas-assembly-0.1-SNAPSHOT.jar s3://support-workers-dist/lambdas/bin/guardian-support-monthly-contributions-lambdas-assembly-0.1-SNAPSHOT.jar
#aws --region eu-west-1 cloudformation update-stack --stack-name "support-workers" --template-body file://cloud-formation/monthly-contribution-step-functions.yaml --capabilities CAPABILITY_NAMED_IAM --profile membership
