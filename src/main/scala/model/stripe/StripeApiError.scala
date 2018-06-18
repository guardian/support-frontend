package model.stripe

import com.stripe.exception._
import PartialFunction.condOpt


case class StripeApiError private (exceptionType: Option[String], responseCode: Option[Int], requestId: Option[String], message: String) extends Exception {
  override val getMessage: String = message
}

object StripeApiError {

  def fromString(message: String): StripeApiError = StripeApiError(None, None, None, message)

  def fromThrowable(err: Throwable): StripeApiError = {
    err match {
      case e: StripeException => fromException(e)
      case _ => fromString(err.getMessage)
    }
  }

  def fromException(err: StripeException): StripeApiError = {
    val exceptionType: Option[String] =  {
      condOpt(err) {
        case _: APIConnectionException => "APIConnectionException"
        case _: APIException => "APIException"
        case _: AuthenticationException => "AuthenticationException"
        case _: CardException => "CardException"
        case _: InvalidRequestException => "InvalidRequestException"
      }
    }

    StripeApiError(exceptionType, Option(err.getStatusCode), Option(err.getRequestId), err.getMessage)
    }

}
