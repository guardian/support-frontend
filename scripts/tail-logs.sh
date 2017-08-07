#!/usr/bin/env bash

if [ "$#" -ne 2 ]; then
    echo "Please provide the Lambda name and stage eg.: ./tail-logs.sh CreateZuoraSubscription PROD"
    exit
fi

LAMBDA="/aws/lambda/support-$1Lambda-$2"
echo "Fetching logs for $LAMBDA"

awslogs get $LAMBDA ALL --aws-region eu-west-1 --watch --profile membership