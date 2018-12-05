package com.gu.support.workers

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import cats.syntax.functor._

sealed trait PaymentFields

case class PayPalPaymentFields(baid: String) extends PaymentFields

case class StripePaymentFields(stripeToken: String) extends PaymentFields

case class DirectDebitPaymentFields(
  accountHolderName: String,
  sortCode: String,
  accountNumber: String
) extends PaymentFields

object PaymentFields {
  //Payment fields are input from support-frontend
  implicit val payPalPaymentFieldsCodec: Codec[PayPalPaymentFields] = deriveCodec
  implicit val stripePaymentFieldsCodec: Codec[StripePaymentFields] = deriveCodec
  implicit val directDebitPaymentFieldsCodec: Codec[DirectDebitPaymentFields] = deriveCodec

  implicit val encodePaymentFields: Encoder[PaymentFields] = Encoder.instance {
    case p: PayPalPaymentFields => p.asJson
    case s: StripePaymentFields => s.asJson
    case d: DirectDebitPaymentFields => d.asJson
  }

  implicit val decodePaymentFields: Decoder[PaymentFields] =
    List[Decoder[PaymentFields]](
      Decoder[PayPalPaymentFields].widen,
      Decoder[StripePaymentFields].widen,
      Decoder[DirectDebitPaymentFields].widen
    ).reduceLeft(_ or _)

}
