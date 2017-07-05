package com.gu.monitoring

import com.amazonaws.regions.Regions.EU_WEST_1
import com.amazonaws.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, PutMetricDataResult}
import com.amazonaws.services.cloudwatch.{AmazonCloudWatchAsync, AmazonCloudWatchAsyncClient}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.config.Configuration
import com.gu.monitoring.CloudWatch.client
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future

class CloudWatch(metrics: Dimension*) extends LazyLogging {

  val application = "SupportWorkers"
  val stageDimension: Dimension = new Dimension().withName("Stage").withValue(Configuration.stage)
  val allDimensions: Seq[Dimension] = metrics :+ stageDimension

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

    AwsAsync(client.putMetricDataAsync, request).map { response =>
      logger.info("CloudWatch PutMetricDataRequest - success")
      response
    } recoverWith {
      case exception =>
        logger.info(s"CloudWatch PutMetricDataRequest error: ${exception.getMessage}}")
        Future.failed(exception)
    }
  }
}

object CloudWatch {

  lazy val client: AmazonCloudWatchAsync = AmazonCloudWatchAsyncClient.asyncBuilder
    .withCredentials(CredentialsProvider)
    .withRegion(EU_WEST_1).build()
}
