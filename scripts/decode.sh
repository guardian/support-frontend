cd ..
sbt --error "project monthly-contributions" "run-main com.gu.support.workers.encoding.StateDecoder $1 $2"