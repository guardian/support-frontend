package services

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{
  MetricDimensionName,
  MetricDimensionValue,
  MetricName,
  MetricNamespace,
  MetricRequest,
}
import model.Environment

class MetricService(environment: Environment) {
  private def stage = environment match {
    case Environment.Test => "CODE"
    case Environment.Live => "PROD"
  }

  def metricPut(
      metricName: String,
  ): Unit = {
    val cloudwatchEvent = MetricRequest(
      MetricNamespace(s"payment-api"),
      MetricName(metricName),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage),
      ),
    )
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
  }
}
