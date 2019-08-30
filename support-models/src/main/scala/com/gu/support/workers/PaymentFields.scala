package com.gu.support.workers

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import cats.syntax.functor._

sealed trait PaymentFields

case class PayPalPaymentFields(baid: String) extends PaymentFields

sealed trait StripePaymentFields extends PaymentFields
case class StripeSourcePaymentFields(stripeToken: String) extends StripePaymentFields // pre SCA compatibility
case class StripePaymentMethodPaymentFields(paymentMethod: String) extends StripePaymentFields

case class DirectDebitPaymentFields(
  accountHolderName: String,
  sortCode: String,
  accountNumber: String
) extends PaymentFields

case class ExistingPaymentFields(billingAccountId: String) extends PaymentFields

object PaymentFields {
  //Payment fields are input from support-frontend
  implicit val payPalPaymentFieldsCodec: Codec[PayPalPaymentFields] = deriveCodec
  implicit val stripeSourcePaymentFieldsCodec: Codec[StripeSourcePaymentFields] = deriveCodec
  implicit val stripePaymentMethodPaymentFieldsCodec: Codec[StripePaymentMethodPaymentFields] = deriveCodec
  implicit val directDebitPaymentFieldsCodec: Codec[DirectDebitPaymentFields] = deriveCodec
  implicit val existingPaymentFieldsCodec: Codec[ExistingPaymentFields] = deriveCodec

  implicit val encodePaymentFields: Encoder[PaymentFields] = Encoder.instance {
    case p: PayPalPaymentFields => p.asJson
    case s: StripeSourcePaymentFields => s.asJson
    case s: StripePaymentMethodPaymentFields => s.asJson
    case d: DirectDebitPaymentFields => d.asJson
    case e: ExistingPaymentFields => e.asJson
  }

  implicit val decodePaymentFields: Decoder[PaymentFields] =
    List[Decoder[PaymentFields]](
      Decoder[PayPalPaymentFields].widen,
      Decoder[StripeSourcePaymentFields].widen,
      Decoder[StripePaymentMethodPaymentFields].widen,
      Decoder[DirectDebitPaymentFields].widen,
      Decoder[ExistingPaymentFields].widen
    ).reduceLeft(_ or _)

}
