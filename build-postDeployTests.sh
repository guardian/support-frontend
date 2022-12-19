#!/bin/bash

DIR=$(dirname $0)

SBT_TGZ="sbt.tgz"
SBT_JAR="sbt-launch.jar"

if [ ! -e $SBT_JAR ]; then
  if [ ! -e $SBT_TGZ ]; then
    echo "Getting SBT..."
    curl -L https://github.com/sbt/sbt/releases/download/v1.5.5/sbt-1.5.5.tgz> $SBT_TGZ
  fi

  tar -xzf $SBT_TGZ
  mv sbt/bin/sbt-launch.jar .
  rm -rf sbt/
  rm -f $SBT_TGZ

fi

java -Xss2m -Xms512m -Xmx1536m -jar sbt-launch.jar selenium:test
RC=$?
if [[ $RC -ne 0 ]]
then
  $DIR/support-frontend/scripts/post_test_results_to_chat.sh
fi

exit $RC
