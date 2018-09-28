#!/usr/bin/env bash

cd "$(dirname "$0")"

STAGE="CODE"

while getopts "s:" opt; do
    case "$opt" in
    s) STAGE=$OPTARG
       ;;
    esac
done

aws s3 cp ./settings.json s3://support-frontend-admin-console/${STAGE}/settings.json \
    --profile membership \
    --region eu-west-1
