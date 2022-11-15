package com.gu.support.workers

import io.circe.{Decoder, Encoder}

import scala.PartialFunction.condOpt

object CheckoutFailureReasons {

  val all = List(
    InsufficientFunds,
    PaymentMethodDetailsIncorrect,
    PaymentMethodTemporarilyDeclined,
    PaymentMethodUnacceptable,
    PaymentProviderUnavailable,
    PaymentRecentlyTaken,
    AccountMismatch,
    AmazonPayTryAnotherCard,
    AmazonPayTryAgain,
    AmazonPayFatal,
    StripePaymentMethodDisabled,
    Unknown,
  )

  def fromString(string: String): Option[CheckoutFailureReason] = all.find(_.asString == string)

  sealed trait CheckoutFailureReason {
    def asString: String
  }

  case object StripePaymentMethodDisabled extends CheckoutFailureReason {
    override def asString: String = "Stripe payments are currently disabled"
  }

  case object InsufficientFunds extends CheckoutFailureReason {
    override def asString: String = "insufficient_funds"
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

  case object AccountMismatch extends CheckoutFailureReason {
    override def asString = "production_test_account_mismatch"
  }

  case object AmazonPayTryAnotherCard extends CheckoutFailureReason {
    override def asString: String = "amazon_pay_try_other_card"
  }

  case object AmazonPayTryAgain extends CheckoutFailureReason {
    override def asString: String = "amazon_pay_try_again"
  }

  case object AmazonPayFatal extends CheckoutFailureReason {
    override def asString: String = "amazon_pay_fatal"
  }

  case object Unknown extends CheckoutFailureReason {
    override def asString: String = "unknown"
  }

  // https://stripe.com/docs/declines/codes
  def convertStripeDeclineCode(declineCode: String): Option[CheckoutFailureReason] = condOpt(declineCode) {
    case "approve_with_id" => PaymentMethodTemporarilyDeclined
    case "call_issuer" => PaymentMethodUnacceptable
    case "card_not_supported" => PaymentMethodUnacceptable
    case "card_velocity_exceeded" => PaymentMethodUnacceptable
    case "currency_not_supported" => PaymentMethodUnacceptable
    case "do_not_honor" => PaymentMethodUnacceptable
    case "do_not_try_again" => PaymentMethodUnacceptable
    case "duplicate_transaction" => PaymentRecentlyTaken
    case "expired_card" => PaymentMethodUnacceptable
    case "fraudulent" => PaymentMethodUnacceptable
    case "generic_decline" => PaymentMethodUnacceptable
    case "incorrect_number" => PaymentMethodDetailsIncorrect
    case "incorrect_cvc" => PaymentMethodDetailsIncorrect
    case "incorrect_pin" => PaymentMethodDetailsIncorrect
    case "incorrect_zip" => PaymentMethodDetailsIncorrect
    case "insufficient_funds" => InsufficientFunds
    case "invalid_account" => PaymentMethodUnacceptable
    case "invalid_amount" => PaymentMethodUnacceptable
    case "invalid_cvc" => PaymentMethodDetailsIncorrect
    case "invalid_expiry_year" => PaymentMethodDetailsIncorrect
    case "invalid_number" => PaymentMethodDetailsIncorrect
    case "invalid_pin" => PaymentMethodDetailsIncorrect
    case "issuer_not_available" => PaymentMethodTemporarilyDeclined
    case "lost_card" => PaymentMethodUnacceptable
    case "new_account_information_available" => PaymentMethodUnacceptable
    case "no_action_taken" => PaymentMethodUnacceptable
    case "not_permitted" => PaymentMethodUnacceptable
    case "pickup_card" => PaymentMethodUnacceptable
    case "pin_try_exceeded" => PaymentMethodUnacceptable
    case "processing_error" => PaymentMethodTemporarilyDeclined
    case "reenter_transaction" => PaymentMethodTemporarilyDeclined
    case "restricted_card" => PaymentMethodUnacceptable
    case "revocation_of_all_authorizations" => PaymentMethodUnacceptable
    case "revocation_of_authorization" => PaymentMethodUnacceptable
    case "security_violation" => PaymentMethodUnacceptable
    case "service_not_allowed" => PaymentMethodUnacceptable
    case "stolen_card" => PaymentMethodUnacceptable
    case "stop_payment_order" => PaymentMethodUnacceptable
    case "transaction_not_allowed" => PaymentMethodUnacceptable
    case "try_again_later" => PaymentMethodTemporarilyDeclined
    case "withdrawal_count_limit_exceeded" => PaymentMethodUnacceptable
    case "Stripe payments are currently disabled" => StripePaymentMethodDisabled
  }

  def convertAmazonPayDeclineCode(declineCode: String): CheckoutFailureReason = declineCode match {
    case "InvalidPaymentMethod" => AmazonPayTryAnotherCard
    case "ProcessingFailure" => AmazonPayTryAgain
    case _ => AmazonPayFatal
  }

  implicit val encodeFailureReason: Encoder[CheckoutFailureReason] =
    Encoder.encodeString.contramap[CheckoutFailureReason](_.asString)

  implicit val decodeFailureReason: Decoder[CheckoutFailureReason] = Decoder.decodeString.emap { identifier =>
    CheckoutFailureReasons.fromString(identifier).toRight(s"Unrecognised failure reason '$identifier'")
  }

}
