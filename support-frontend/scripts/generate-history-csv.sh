#!/bin/sh
set -e

base=$(dirname $0)

printErrorsForCommit() {
  commit=$1
  date=$2
  data=$3
  grep -E '"TS[^"]*": [0-9]+' <<< "$data" \
    | sed 's/^[^:]*: //' \
    | sed 's/,//' \
    | awk "{ sum += \$1 } END { print \"${date}000,\" sum  \",$commit\"}"
}

commitdatelist=$(
  git log main --merges --first-parent main eb6eea107e4fcfd82c63b7b59de85ffce500cae7..HEAD --pretty=format:"%H %at" \
    | sort -n -k 2
)

while read commit
do
  read -a commitdate <<< "$commit"
  errorsFileContent=$(git show ${commitdate[0]}:support-frontend/typescript-errors.json)
  printErrorsForCommit ${commitdate[0]} ${commitdate[1]} "$errorsFileContent"
done <<< "$commitdatelist"


printErrorsForCommit "HEAD" "$(date +%s)" "$(cat $base/../typescript-errors.json)"
