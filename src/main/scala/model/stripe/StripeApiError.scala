package model.stripe

case class StripeApiError private (message: String) extends Exception {
  override val getMessage: String = message
}

object StripeApiError {

  // TODO: should this method utilise the type of exception thrown?
  def fromThrowable(err: Throwable): StripeApiError =
    StripeApiError(err.getMessage)
}
