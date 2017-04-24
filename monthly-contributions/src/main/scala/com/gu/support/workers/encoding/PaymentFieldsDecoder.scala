package com.gu.support.workers.encoding

import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields}
import io.circe.{Decoder, DecodingFailure, HCursor}

object PaymentFieldsDecoder {
  implicit val decodePaymentFields: Decoder[Either[StripePaymentFields, PayPalPaymentFields]] = new Decoder[Either[StripePaymentFields, PayPalPaymentFields]] {
    final def apply(c: HCursor): Decoder.Result[Either[StripePaymentFields, PayPalPaymentFields]] = {
      val payPalBaid = c.value \\ "paypalBaid"
      val userId = c.value \\ "userId"
      val stripeToken = c.value \\"stripeToken"

      (payPalBaid.headOption, userId.headOption, stripeToken.headOption) match {
        case (Some(baid), None, None) => Right(Right(PayPalPaymentFields(baid.asString.get)))
        case (None, Some(id), Some(token)) => Right(Left(StripePaymentFields(id.asString.get, token.asString.get)))
        case _ => Left(DecodingFailure(s"Invalid input:\n${c.value}", c.history))
      }
    }

  }
}
