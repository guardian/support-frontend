package com.gu.monitoring

import java.util.concurrent.Future

import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.regions.Regions.EU_WEST_1
import com.amazonaws.services.cloudwatch.{AmazonCloudWatchAsync, AmazonCloudWatchAsyncClient, AmazonCloudWatchAsyncClientBuilder}
import com.amazonaws.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, PutMetricDataResult}
import com.gu.aws.CredentialsProvider
import com.gu.config.Configuration
import com.gu.monitoring.CloudWatch.client
import com.typesafe.scalalogging.LazyLogging

class CloudWatch(metrics: Seq[Dimension]) extends LazyLogging {

  val application = "SupportWorkers"

  //Common Dimensions
  val commonDimensions: Seq[Dimension] =
    Seq(new Dimension().withName("Stage").withValue(Configuration.stage))

  val allDimensions: Seq[Dimension] = commonDimensions ++ metrics

  trait LoggingAsyncHandler extends AsyncHandler[PutMetricDataRequest, PutMetricDataResult] {
    def onError(exception: Exception) {
      logger.info(s"CloudWatch PutMetricDataRequest error: ${exception.getMessage}}")
    }
    def onSuccess(request: PutMetricDataRequest, result: PutMetricDataResult) {
      logger.info("CloudWatch PutMetricDataRequest - success")
      CloudWatchHealth.hasPushedMetricSuccessfully = true
    }
  }

  object LoggingAsyncHandler extends LoggingAsyncHandler

  def put(name: String, count: Double): Future[PutMetricDataResult] = {
    val metric =
      new MetricDatum()
        .withValue(count)
        .withMetricName(name)
        .withUnit("Count")
        .withDimensions(allDimensions: _*)

    val request =
      new PutMetricDataRequest()
        .withNamespace(application)
        .withMetricData(metric)

    client.putMetricDataAsync(request, LoggingAsyncHandler)
  }
}

object CloudWatch {

  lazy val client: AmazonCloudWatchAsync = AmazonCloudWatchAsyncClient.asyncBuilder
    .withCredentials(CredentialsProvider)
    .withRegion(EU_WEST_1).build()
}

object CloudWatchHealth {
  var hasPushedMetricSuccessfully = false
}