package services

import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, PutMetricDataResult}
import com.typesafe.scalalogging.StrictLogging

import model.{Environment, PaymentProvider}

class CloudWatchService(cloudWatchAsyncClient: AmazonCloudWatchAsync, environment: Environment) {

  private val namespace = {
    val qualifier = if (environment == Environment.Live) "PROD" else "CODE"
    s"support-payment-api-$qualifier"
  }

  def logPaymentSuccess(paymentProvider: PaymentProvider): Unit = {

    val paymentProviderDimension = new Dimension()
      .withName("payment-provider")
      .withValue(paymentProvider.entryName)

    val metric = new MetricDatum()
      .withValue(1d)
      .withMetricName("payment-success")
      .withUnit("Count")
      .withDimensions(paymentProviderDimension)

    val request = new PutMetricDataRequest()
      .withNamespace(namespace)
      .withMetricData(metric)

    cloudWatchAsyncClient.putMetricDataAsync(request, CloudWatchService.LoggingAsyncHandler)
  }
}

object CloudWatchService {

  private object LoggingAsyncHandler extends AsyncHandler[PutMetricDataRequest, PutMetricDataResult] with StrictLogging {

    def onError(exception: Exception): Unit = {
      logger.error("cloud watch service error", exception)
    }

    def onSuccess(request: PutMetricDataRequest, result: PutMetricDataResult): Unit = ()
  }
}


