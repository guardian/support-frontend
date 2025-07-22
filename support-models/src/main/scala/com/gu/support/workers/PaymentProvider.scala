package com.gu.support.workers

import io.circe.{Decoder, Encoder}

sealed abstract class PaymentProvider(val name: String)

case object Stripe extends PaymentProvider("Stripe")

case object StripeApplePay extends PaymentProvider("StripeApplePay")

case object StripePaymentRequestButton extends PaymentProvider("StripePaymentRequestButton")

case object PayPal extends PaymentProvider("PayPal")

case object DirectDebit extends PaymentProvider("DirectDebit")

case object Sepa extends PaymentProvider("Sepa")

case object Existing extends PaymentProvider("Existing")

case object StripeHostedCheckout extends PaymentProvider("StripeHostedCheckout")

case object RedemptionNoProvider extends PaymentProvider("Redemption")

object PaymentProvider {

  val all = List(
    Stripe,
    StripeApplePay,
    StripePaymentRequestButton,
    PayPal,
    DirectDebit,
    Sepa,
    Existing,
    RedemptionNoProvider,
    StripeHostedCheckout,
  )

  def fromString(code: String): Option[PaymentProvider] = {
    all.find(_.getClass.getSimpleName == s"$code$$")
  }

  implicit val decoder: Decoder[PaymentProvider] =
    Decoder.decodeString.emap(code =>
      PaymentProvider.fromString(code).toRight(s"unrecognised payment provider '$code'"),
    )

  implicit val encoder: Encoder[PaymentProvider] = Encoder.encodeString.contramap[PaymentProvider](_.toString)

  def fromPaymentFields(paymentFields: PaymentFields): PaymentProvider = paymentFields match {
    case stripe: StripePaymentFields =>
      stripe.stripePaymentType match {
        case Some(StripePaymentType.StripeApplePay) => StripeApplePay
        case Some(StripePaymentType.StripePaymentRequestButton) => StripePaymentRequestButton
        case _ => Stripe
      }
    case _: PayPalPaymentFields => PayPal
    case _: DirectDebitPaymentFields => DirectDebit
    case _: SepaPaymentFields => Sepa
    case _: StripeHostedPaymentFields => StripeHostedCheckout
  }

}
