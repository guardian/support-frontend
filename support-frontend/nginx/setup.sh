#!/usr/bin/env bash

DOMAIN=support.thegulocal.com
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_CONFIG=${DIR}/support.conf

DOMAINS=(
  "support.thegulocal.com"
  "support-ui.thegulocal.com"
)

for domain in ${DOMAINS[@]}; do
  dev-nginx setup-cert $domain
done

dev-nginx link-config ${SITE_CONFIG}
dev-nginx restart-nginx
