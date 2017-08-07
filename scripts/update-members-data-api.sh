#!/usr/bin/env bash

ids=(000 111 222) #Add Identity ids of users you wish to update here
apiKey="add apiKey here"

for i in ${ids[@]}; do
  url="https://members-data-api.theguardian.com/user-attributes/${i}"
  echo "\n\nUpdating user ${url}\n\n"
  curl -v \
  -H "Authorization: Bearer $apiKey" \
  -H "Content-Type: application/json" \
  -d '{}' $url

done