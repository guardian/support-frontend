package com.gu.support.workers.model

object CheckoutFailureReasons {

  val all = List(PaymentMethodUnacceptable, PaymentMethodDetailsIncorrect, PaymentAlreadyTaken, Unknown)
  def fromString(string: String): Option[CheckoutFailureReason] = all.find(_.toString == string)

  sealed trait CheckoutFailureReason
  case object PaymentMethodUnacceptable extends CheckoutFailureReason
  case object PaymentMethodDetailsIncorrect extends CheckoutFailureReason
  case object PaymentAlreadyTaken extends CheckoutFailureReason
  case object PaymentProviderUnavailable extends CheckoutFailureReason
  case object Unknown extends CheckoutFailureReason

}

