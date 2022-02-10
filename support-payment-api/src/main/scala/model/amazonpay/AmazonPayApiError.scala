package model.amazonpay

import com.gu.support.workers.CheckoutFailureReasons
import io.circe.generic.JsonCodec

@JsonCodec
case class AmazonPayApiError(responseCode: Option[Int], message: String, failureReason: Option[String] = None)
    extends Exception {
  override val getMessage: String = message
}

object AmazonPayApiError {

  def fromString(message: String): AmazonPayApiError = AmazonPayApiError(None, message)

  def withReason(code: Int, message: String, reason: String): AmazonPayApiError = {
    val clientReason = CheckoutFailureReasons.convertAmazonPayDeclineCode(reason)
    AmazonPayApiError(Some(code), message, Some(clientReason.asString))
  }
}
