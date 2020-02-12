package model.stripe

import com.stripe.exception._
import PartialFunction.condOpt

// exceptionType: The type of exception - eg CardException, ApiException etc
//
// responseCode: The http status code returned by the Stripe API: eg 400, 403, 500 etc.
// See here for more details on exception types and http status codes: https://stripe.com/docs/api/java#errors
//
// declineCode: Detailed information from the card issuer which explains why a charge was declined. Only relevant for CardExceptions.
// https://stripe.com/docs/declines/codes
//
// requestID: This field contains an identifying key for the request which can be used for debugging and investigating any failures

case class StripeApiError(exceptionType: Option[String], responseCode: Option[Int], declineCode: Option[String], message: String, publicKey: Option[String]) extends Exception {
  override val getMessage: String = publicKey.map(pk => s"$message. (Public key was $pk)").getOrElse(message)
}

object StripeApiError {

  def fromString(message: String, publicKey: Option[String]): StripeApiError = StripeApiError(None, None, None, message, publicKey)

  def fromThrowable(err: Throwable, publicKey: Option[String]): StripeApiError = {
    err match {
      case e: StripeException => fromStripeException(e, publicKey)
      case _ => fromString(err.getMessage, publicKey)
    }
  }

  def fromStripeException(err: StripeException, publicKey: Option[String]): StripeApiError = {
    val exceptionType: Option[String] = {
      condOpt(err) {
        case _: ApiConnectionException => "ApiConnectionException"
        case _: ApiException => "ApiException"
        case _: AuthenticationException => "AuthenticationException"
        case _: CardException => "CardException"
        case _: InvalidRequestException => "InvalidRequestException"
      }
    }

    val declineCode: Option[String] = condOpt(err) { case e: CardException => e.getDeclineCode }

    StripeApiError(exceptionType, Option(err.getStatusCode), declineCode, err.getMessage, publicKey)

  }
}