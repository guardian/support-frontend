package model.stripe

import com.stripe.exception._
import io.circe.generic.JsonCodec

import PartialFunction.condOpt

// exceptionType: The type of exception - eg CardException, ApiException etc
//
// responseCode: The http status code returned by the Stripe API: eg 400, 403, 500 etc.
// See here for more details on exception types and http status codes: https://stripe.com/docs/api/java#errors
//
// errorName: For some exception types, such as CardException, there is an extra field which gives a more detailed name
// for the error - this can normally be displayed to the user.
// See here for more information on errorNames (NB: Stripe calls these error codes):
// https://stripe.com/docs/error-codes
//
// requestID: This field contains an identifying key for the request which can be used for debugging and investigating any failures

@JsonCodec case class StripeApiError private (exceptionType: Option[String], responseCode: Option[Int], errorName: Option[String], message: String) extends Exception {
  override val getMessage: String = message
}

object StripeApiError {

  def fromString(message: String): StripeApiError = StripeApiError(None, None, None, message)

  def fromThrowable(err: Throwable): StripeApiError = {
    err match {
      case e: StripeException => fromStripeException(e)
      case _ => fromString(err.getMessage)
    }
  }

  def fromStripeException(err: StripeException): StripeApiError = {
    val exceptionType: Option[String] = {
      condOpt(err) {
        case _: APIConnectionException => "APIConnectionException"
        case _: APIException => "APIException"
        case _: AuthenticationException => "AuthenticationException"
        case _: CardException => "CardException"
        case _: InvalidRequestException => "InvalidRequestException"
      }
    }

    val errorName: Option[String] = condOpt(err) { case e: CardException => e.getCode }

    StripeApiError(exceptionType, Option(err.getStatusCode), errorName, err.getMessage)

  }
}