package services

import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, PutMetricDataResult}
import com.typesafe.scalalogging.StrictLogging
import model.paypal.PaypalApiError
import model.stripe.StripeApiError
import model.{Environment, PaymentProvider}

class CloudWatchService(cloudWatchAsyncClient: AmazonCloudWatchAsync, environment: Environment) {

  private val namespace = {
    val qualifier = if (environment == Environment.Live) "PROD" else "CODE"
    s"support-payment-api-$qualifier"
  }

  def put(metricName: String, paymentProvider: PaymentProvider): Unit = {
    val paymentProviderDimension = new Dimension()
      .withName("payment-provider")
      .withValue(paymentProvider.entryName)

    val metric = new MetricDatum()
      .withValue(1d)
      .withMetricName(metricName)
      .withUnit("Count")
      .withDimensions(paymentProviderDimension)

    val request = new PutMetricDataRequest()
      .withNamespace(namespace)
      .withMetricData(metric)

    cloudWatchAsyncClient.putMetricDataAsync(request, CloudWatchService.LoggingAsyncHandler)
  }

  def recordPaymentSuccess(paymentProvider: PaymentProvider): Unit = put("payment-success", paymentProvider)

  def recordFailedPayment(error: Exception, paymentProvider: PaymentProvider): Unit = {
    if (isPaymentError(error))
      put("payment-error", paymentProvider)
    else
      put("failed-payment", paymentProvider)
  }

  def isPaymentError(error: Exception): Boolean = {
    // Payment errors are failures caused by something other than problems with the contributors card or account.
    // These are worthy of further investigation and will be used to trigger alerts
    error match {
      case e: StripeApiError => !e.exceptionType.contains("CardException")
      case e: PaypalApiError => e.errorName.getOrElse("") match {
          case ("CREDIT_CARD_CVV_CHECK_FAILED") => false
          case ("CREDIT_CARD_REFUSED") => false
          case ("INSTRUMENT_DECLINED") => false
          case ("INSUFFICIENT_FUNDS") => false
          case _ => true
        }
      case _ => true
    }
  }

  def recordPostPaymentTasksError(paymentProvider: PaymentProvider): Unit = put("post-payment-tasks-error", paymentProvider)

}

object CloudWatchService {

  private object LoggingAsyncHandler extends AsyncHandler[PutMetricDataRequest, PutMetricDataResult] with StrictLogging {

    def onError(exception: Exception): Unit = {
      logger.error("cloud watch service error", exception)
    }

    def onSuccess(request: PutMetricDataRequest, result: PutMetricDataResult): Unit = ()
  }
}


