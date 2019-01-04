package model

import enumeratum.{Enum, EnumEntry}
import model.stripe.StripePaymentMethod

import scala.collection.immutable.IndexedSeq

sealed abstract class PaymentProvider extends EnumEntry

object PaymentProvider extends Enum[PaymentProvider] {

  def fromStripePaymentMethod(stripePaymentMethod: Option[StripePaymentMethod]): PaymentProvider = {
    stripePaymentMethod match {
      case Some(StripePaymentMethod.StripeCheckout) | None => PaymentProvider.Stripe
      case Some(StripePaymentMethod.StripeApplePay) => PaymentProvider.StripeApplePay
      case Some(StripePaymentMethod.StripePaymentRequestButton) => PaymentProvider.StripePaymentRequestButton
    }
  }

  override val values: IndexedSeq[PaymentProvider] = findValues
  case object Paypal extends PaymentProvider
  case object Stripe extends PaymentProvider
  case object StripeApplePay extends PaymentProvider
  case object StripePaymentRequestButton extends PaymentProvider
}
