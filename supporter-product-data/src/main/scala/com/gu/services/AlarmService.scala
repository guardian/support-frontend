package com.gu.services

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{
  MetricDimensionName,
  MetricDimensionValue,
  MetricName,
  MetricNamespace,
  MetricRequest,
}
import com.gu.supporterdata.model.Stage
import scala.util.Try

class AlarmService(stage: Stage) {

  def triggerCsvReadAlarm: Try[Unit] = {
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
      MetricRequest(
        MetricNamespace("supporter-product-data"),
        MetricName("CsvReadFailure"),
        Map(MetricDimensionName("Stage") -> MetricDimensionValue(stage.value)),
      ),
    )
  }

  def triggerDynamoWriteAlarm: Try[Unit] = {
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
      MetricRequest(
        MetricNamespace("supporter-product-data"),
        MetricName("DynamoWriteFailure"),
        Map(MetricDimensionName("Stage") -> MetricDimensionValue(stage.value)),
      ),
    )
  }

  def triggerSQSWriteAlarm: Try[Unit] = {
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
      MetricRequest(
        MetricNamespace("supporter-product-data"),
        MetricName("SqsWriteFailure"),
        Map(MetricDimensionName("Stage") -> MetricDimensionValue(stage.value)),
      ),
    )
  }
}

object AlarmService {
  def apply(stage: Stage) = new AlarmService(stage)
}
