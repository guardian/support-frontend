package model.amazonpay

import io.circe.generic.JsonCodec

@JsonCodec
case class AmazonPayApiError(responseCode: Option[Int], message: String, failureReason: Option[String] = None) extends Exception {
  override val getMessage: String = message
}

object AmazonPayApiError {
  val TryAnotherCard = "amazon_pay_try_other_card"
  val TryAgain = "amazon_pay_try_again"
  val Fatal = "amazon_pay_fatal"

  def fromString(message: String): AmazonPayApiError = AmazonPayApiError(None, message)

  def withReason(code: Int, message: String, reason: String): AmazonPayApiError = {

    val clientReason = reason match {
      case "InvalidPaymentMethod" => TryAnotherCard
      case "ProcessingFailure" => TryAgain
      case "TransactionTimedOut" => Fatal  //we should never see this in theory as we are capturing the funds on auth
      case _ => Fatal
    }

    AmazonPayApiError(Some(code), message, Some(clientReason))

  }

  def fromThrowable(err: Throwable): AmazonPayApiError = fromString(err.getMessage)

}
