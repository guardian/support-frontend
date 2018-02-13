package model.stripe

case class StripeChargeError private (message: String) extends Exception {
  override val getMessage: String = message
}

object StripeChargeError {

  // TODO: should this method utilise the type of exception thrown?
  def fromThrowable(err: Throwable): StripeChargeError =
    StripeChargeError(err.getMessage)
}
