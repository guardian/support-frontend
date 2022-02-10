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

case object RedemptionNoProvider extends PaymentProvider("Redemption")

case object AmazonPay extends PaymentProvider("AmazonPay")

object PaymentProvider {

  val all = List(
    Stripe,
    StripeApplePay,
    PayPal,
    DirectDebit,
    Sepa,
    Existing,
    RedemptionNoProvider,
    AmazonPay,
  )

  def fromString(code: String): Option[PaymentProvider] = {
    all.find(_.getClass.getSimpleName == s"$code$$")
  }

  implicit val decoder: Decoder[PaymentProvider] =
    Decoder.decodeString.emap(code =>
      PaymentProvider.fromString(code).toRight(s"unrecognised payment provider '$code'"),
    )

  implicit val encoder: Encoder[PaymentProvider] = Encoder.encodeString.contramap[PaymentProvider](_.toString)

  def fromPaymentFields(paymentFields: Option[PaymentFields]): PaymentProvider = paymentFields match {
    case Some(stripe: StripePaymentFields) =>
      stripe.stripePaymentType match {
        case Some(StripePaymentType.StripeApplePay) => StripeApplePay
        case _ => Stripe
      }
    case Some(_: PayPalPaymentFields) => PayPal
    case Some(_: DirectDebitPaymentFields) => DirectDebit
    case Some(_: SepaPaymentFields) => Sepa
    case Some(_: ExistingPaymentFields) => Existing
    case Some(_: AmazonPayPaymentFields) => AmazonPay
    case None /* Corporate*/ => RedemptionNoProvider
  }

}
