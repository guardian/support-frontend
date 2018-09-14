package lib

import io.circe.{Error => CirceError}
import services.PayPalErrorBody

sealed abstract class PaymentApiError extends Exception {
  override def getMessage: String = this match {
    case PaymentApiError.PayPalError(err) => err.message
    case PaymentApiError.InvalidJsonReponse(err) => err.getMessage
  }

  def errorName: Option[String] = this match {
    case PaymentApiError.PayPalError(err) => err.errorName
    case PaymentApiError.InvalidJsonReponse(err) => Some("Error decoding Json")
  }

}

object PaymentApiError {
  final case class PayPalError(error: PayPalErrorBody) extends PaymentApiError
  final case class InvalidJsonReponse(error: CirceError) extends PaymentApiError

  def fromPalPayError(err: PayPalErrorBody): PaymentApiError = PayPalError(err)
  def fromCirceDecodingError(err: CirceError): PaymentApiError = InvalidJsonReponse(err)

}