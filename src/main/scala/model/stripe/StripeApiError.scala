package model.stripe

import com.stripe.exception._


case class StripeApiError private (responseCode: Option[Int], requestId: Option[String], message: String) extends Exception {
  override val getMessage: String = message
}

object StripeApiError {

  def fromString(message: String): StripeApiError = StripeApiError(None, None, message)

  def fromThrowable(err: Throwable): StripeApiError = {
    err match {
      case e: StripeException => fromException(e)
      case _ => fromString(err.getMessage)
    }
  }

  def fromException(err: StripeException): StripeApiError = {
      StripeApiError(Option(err.getStatusCode), Option(err.getRequestId), err.getMessage)
    }

}
