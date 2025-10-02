package services

import backend.BackendError
import com.typesafe.scalalogging.StrictLogging
import model.paypal.PaypalApiError
import model.stripe.StripeApiError
import model.{Environment, PaymentProvider}
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient
import software.amazon.awssdk.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest}

class CloudWatchService(cloudWatchAsyncClient: CloudWatchAsyncClient, environment: Environment) extends StrictLogging {

  private val namespace = {
    val qualifier = if (environment == Environment.Live) "PROD" else "CODE"
    s"support-payment-api-$qualifier"
  }

  def put(metricName: String, paymentProvider: PaymentProvider): Unit = {
    val paymentProviderDimension = Dimension
      .builder()
      .name("payment-provider")
      .value(paymentProvider.entryName)
      .build()

    val metric = MetricDatum
      .builder()
      .value(1d)
      .metricName(metricName)
      .unit("Count")
      .dimensions(paymentProviderDimension)
      .build()

    val request = PutMetricDataRequest
      .builder()
      .namespace(namespace)
      .metricData(metric)
      .build()

    cloudWatchAsyncClient
      .putMetricData(request)
      .exceptionally((t: Throwable) => {
        logger.error(s"Failed to put metric $metricName to CloudWatch", t)
        null
      })
  }

  def recordPaymentSuccess(paymentProvider: PaymentProvider): Unit = put("payment-success", paymentProvider)

  def recordFailedPayment(error: Exception, paymentProvider: PaymentProvider): Unit = {
    if (isPaymentError(error)) {
      logger.error(s"Payment error with $paymentProvider", error)
      put("payment-error", paymentProvider)
    } else {
      logger.info(s"Payment failure with $paymentProvider", error)
      put("failed-payment", paymentProvider)
    }
  }

  def isPaymentError(error: Exception): Boolean = {
    // Payment errors are failures caused by something other than problems with the contributors card or account.
    // These are worthy of further investigation and will be used to trigger alerts
    error match {
      case e: StripeApiError => !e.exceptionType.contains("CardException")
      case e: PaypalApiError =>
        e.errorName.getOrElse("") match {
          case ("CREDIT_CARD_CVV_CHECK_FAILED") => false
          case ("CREDIT_CARD_REFUSED") => false
          case ("INSTRUMENT_DECLINED") => false
          case ("INSUFFICIENT_FUNDS") => false
          // PAYMENT_ALREADY_DONE is a valid error, but currently alerting too often and possibly masking other errors
          // Adding this error to the filter list until we can get it fixed.
          case ("PAYMENT_ALREADY_DONE") => false
          case _ => true
        }
      case _ => true
    }
  }

  def recordPostPaymentTasksErrors(paymentProvider: PaymentProvider, errors: List[BackendError]): Unit = {
    if (errors.nonEmpty) {
      recordPostPaymentTasksError(
        paymentProvider,
        s"unable to track contribution due to error: ${errors.mkString(" & ")}",
      )
    }
  }

  def recordPostPaymentTasksError(paymentProvider: PaymentProvider, message: String): Unit = {
    logger.error(s"Post-payment task error for $paymentProvider: $message")
    put("post-payment-tasks-error", paymentProvider)
  }

  def recordTrackingRefundFailure(paymentProvider: PaymentProvider): Unit =
    put("tracking-refund-failure", paymentProvider)

}
