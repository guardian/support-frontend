#!/usr/bin/env bash

aws s3 cp s3://membership-private/DEV/support-frontend.private.conf \
  /etc/gu/support-frontend.private.conf \
  --profile membership
