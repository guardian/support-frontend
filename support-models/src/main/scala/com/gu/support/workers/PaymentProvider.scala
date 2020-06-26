package com.gu.support.workers

import com.gu.support.redemptions.RedemptionData
import io.circe.{Decoder, Encoder}

sealed trait PaymentProvider

case object Stripe extends PaymentProvider

case object StripeApplePay extends PaymentProvider

case object PayPal extends PaymentProvider

case object DirectDebit extends PaymentProvider

case object Existing extends PaymentProvider

case object RedemptionNoProvider extends PaymentProvider

object PaymentProvider {

  val all = List(
    Stripe,
    StripeApplePay,
    PayPal,
    DirectDebit,
    Existing,
    RedemptionNoProvider
  )

  def fromString(code: String): Option[PaymentProvider] = {
    all.find(_.getClass.getSimpleName == s"$code$$")
  }

  implicit val decoder: Decoder[PaymentProvider] =
    Decoder.decodeString.emap(code => PaymentProvider.fromString(code).toRight(s"unrecognised payment provider '$code'"))

  implicit val encoder: Encoder[PaymentProvider] = Encoder.encodeString.contramap[PaymentProvider](_.toString)

  def fromPaymentFields(paymentFields: Option[PaymentFields]): PaymentProvider = paymentFields match {
    case Some(stripe: StripePaymentFields) => stripe.stripePaymentType match {
      case Some(StripePaymentType.StripeApplePay) => StripeApplePay
      case _ => Stripe
    }
    case Some(_: PayPalPaymentFields) => PayPal
    case Some(_: DirectDebitPaymentFields) => DirectDebit
    case Some(_: ExistingPaymentFields) => Existing
    case None /* Corporate*/ => RedemptionNoProvider
  }

  def fromPaymentMethod(paymentMethod: Option[PaymentMethod]): PaymentProvider = paymentMethod match {
    case Some(creditCardPayment: CreditCardReferenceTransaction) =>
      creditCardPayment.stripePaymentType match {
        case Some(StripePaymentType.StripeApplePay) => StripeApplePay
        case _ => Stripe
      }
    case Some(_: PayPalReferenceTransaction) => PayPal
    case Some(_: DirectDebitPaymentMethod) => DirectDebit
    case Some(_: ClonedDirectDebitPaymentMethod) => Existing
    case None /*Corporate*/=> RedemptionNoProvider
  }

}
