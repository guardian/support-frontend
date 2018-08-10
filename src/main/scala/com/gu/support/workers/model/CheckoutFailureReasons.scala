package com.gu.support.workers.model

object CheckoutFailureReasons {

  val all = List(PaymentMethodUnacceptable, PaymentMethodDetailsIncorrect, PaymentRecentlyTaken, Unknown)
  def fromString(string: String): Option[CheckoutFailureReason] = all.find(_.toString == string)

  sealed trait CheckoutFailureReason {
    def asString: String
  }

  case object PaymentMethodUnacceptable extends CheckoutFailureReason {
    override def asString: String = "payment_method_unacceptable"
  }

  case object PaymentMethodDetailsIncorrect extends CheckoutFailureReason {
    override def asString: String = "payment_details_incorrect"
  }

  case object PaymentRecentlyTaken extends CheckoutFailureReason {
    override def asString: String = "payment_recently_taken"
  }

  case object PaymentProviderUnavailable extends CheckoutFailureReason {
    override def asString: String = "payment_provider_unavailable"
  }

  case object Unknown extends CheckoutFailureReason {
    override def asString: String = "unknown"
  }

}

