#!/usr/bin/env bash
# To populate the required test data, run this script.
set -e
set -v

table=$1
if [ -z "$table" ]
  then
    echo syntax: $0 tablename
    exit 1
fi

function create {
  code=$1
  echo $code
  if [[ "$code" == 'ITTEST-USED' ]]; then
    value='false'
  else
    value='true'
  fi
  itemL='{"redemptionCode": {"S": "'
  itemM='"}, "available": {"BOOL": '
  itemR='}, "type": {"S": "Corporate"}, "corporateId": {"S": "1"}}'
  item="$itemL$code$itemM$value$itemR"
  echo item: $item
  echo $code|hexdump -C
  aws dynamodb put-item --profile membership --table-name $table --item "$item"
  err=$?
  if [[ err -ne 0 ]]; then
    echo Failed with $err
    exit 1
  fi
}

create 'ITTEST- !\"#$%&'"'"'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
create 'ITTEST-MUTABLE- !\"#$%&'"'"'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
create 'ITTEST-AVAILABLE'
create 'ITTEST-USED'
#create 'ITTEST-MISSING'
create 'ITTEST-MUTABLE'
