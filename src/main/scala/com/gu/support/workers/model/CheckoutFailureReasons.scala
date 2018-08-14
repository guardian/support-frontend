package com.gu.support.workers.model

object CheckoutFailureReasons {

  val all = List(
    PaymentMethodDetailsIncorrect,
    PaymentMethodTemporarilyDeclined,
    PaymentMethodUnacceptable,
    PaymentProviderUnavailable,
    PaymentRecentlyTaken,
    Unknown
  )

  def fromString(string: String): Option[CheckoutFailureReason] = all.find(_.asString == string)

  sealed trait CheckoutFailureReason {
    def asString: String
  }

  case object PaymentMethodDetailsIncorrect extends CheckoutFailureReason {
    override def asString: String = "payment_details_incorrect"
  }

  case object PaymentMethodTemporarilyDeclined extends CheckoutFailureReason {
    override def asString: String = "payment_method_temporarily_declined"
  }

  case object PaymentMethodUnacceptable extends CheckoutFailureReason {
    override def asString: String = "payment_method_unacceptable"
  }

  case object PaymentProviderUnavailable extends CheckoutFailureReason {
    override def asString: String = "payment_provider_unavailable"
  }

  case object PaymentRecentlyTaken extends CheckoutFailureReason {
    override def asString: String = "payment_recently_taken"
  }

  case object Unknown extends CheckoutFailureReason {
    override def asString: String = "unknown"
  }

  // https://stripe.com/docs/declines/codes
  def convertStripeDeclineCode(declineCode: String): Option[CheckoutFailureReason] = declineCode match {
    case "approve_with_id" => Some(PaymentMethodTemporarilyDeclined)
    case "call_issuer" => Some(PaymentMethodUnacceptable)
    case "card_not_supported" => Some(PaymentMethodUnacceptable)
    case "card_velocity_exceeded" => Some(PaymentMethodUnacceptable)
    case "currency_not_supported" => Some(PaymentMethodUnacceptable)
    case "transaction_not_allowed" => Some(PaymentMethodUnacceptable)
    case "do_not_honor" => Some(PaymentMethodUnacceptable)
    case "do_not_try_again" => Some(PaymentMethodUnacceptable)
    case "duplicate_transaction" => Some(PaymentRecentlyTaken)
    case "expired_card" => Some(PaymentMethodUnacceptable)
    case "fraudulent" => Some(PaymentMethodUnacceptable)
    case "generic_decline" => Some(PaymentMethodUnacceptable)
    case "incorrect_number" => Some(PaymentMethodDetailsIncorrect)
    case "incorrect_cvc" => Some(PaymentMethodDetailsIncorrect)
    case "incorrect_pin" => Some(PaymentMethodDetailsIncorrect)
    case "incorrect_zip" => Some(PaymentMethodDetailsIncorrect)
    case "insufficient_funds" => Some(PaymentMethodUnacceptable)
    case "invalid_account" => Some(PaymentMethodUnacceptable)
    case "invalid_amount" => Some(PaymentMethodUnacceptable)
    case "invalid_cvc" => Some(PaymentMethodDetailsIncorrect)
    case "invalid_expiry_year" => Some(PaymentMethodDetailsIncorrect)
    case "invalid_number" => Some(PaymentMethodDetailsIncorrect)
    case "invalid_pin" => Some(PaymentMethodDetailsIncorrect)
    case "issuer_not_available" => Some(PaymentMethodTemporarilyDeclined)
    case "lost_card" => Some(PaymentMethodUnacceptable)
    case "new_account_information_available" => Some(PaymentMethodUnacceptable)
    case "no_action_taken" => Some(PaymentMethodUnacceptable)
    case "not_permitted" => Some(PaymentMethodUnacceptable)
    case "pickup_card" => Some(PaymentMethodUnacceptable)
    case "pin_try_exceeded" => Some(PaymentMethodUnacceptable)
    case "processing_error" => Some(PaymentMethodTemporarilyDeclined)
    case "reenter_transaction" => Some(PaymentMethodTemporarilyDeclined)
    case "restricted_card" => Some(PaymentMethodUnacceptable)
    case "revocation_of_all_authorizations" => Some(PaymentMethodUnacceptable)
    case "revocation_of_authorization" => Some(PaymentMethodUnacceptable)
    case "security_violation" => Some(PaymentMethodUnacceptable)
    case "service_not_allowed" => Some(PaymentMethodUnacceptable)
    case "stolen_card" => Some(PaymentMethodUnacceptable)
    case "stop_payment_order" => Some(PaymentMethodUnacceptable)
    case "transaction_not_allowed" => Some(PaymentMethodUnacceptable)
    case "try_again_later" => Some(PaymentMethodTemporarilyDeclined)
    case "withdrawal_count_limit_exceeded" => Some(PaymentMethodUnacceptable)
    case _ => None
  }

}

