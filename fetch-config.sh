#!/usr/bin/env bash

CONFIG_DIR=/etc/gu

if [[ -w ${CONFIG_DIR} ]]; then
  aws s3 cp s3://membership-private/DEV/support-frontend.private.conf \
    ${CONFIG_DIR}/support-frontend.private.conf \
    --profile membership
else
  echo "ERROR! Cannot write to ${CONFIG_DIR}. Check it exists and you have write permissions to it.";
  echo "  'sudo chown -R $(whoami):admin ${CONFIG_DIR}' will make you the owner of ${CONFIG_DIR}";
fi
