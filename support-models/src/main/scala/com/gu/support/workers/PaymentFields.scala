package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.syntax._
import io.circe.{Encoder, _}

sealed trait PaymentFields

case class PayPalPaymentFields(baid: String) extends PaymentFields

sealed trait StripePaymentFields extends PaymentFields {
  val stripePaymentType: Option[StripePaymentType]
}

case class StripeSourcePaymentFields(
    stripeToken: String,
    stripePaymentType: Option[StripePaymentType],
) extends StripePaymentFields // pre SCA compatibility

case class StripePaymentMethodPaymentFields(
    paymentMethod: PaymentMethodId,
    stripePaymentType: Option[StripePaymentType],
) extends StripePaymentFields

object PaymentMethodId {

  def apply(value: String): Option[PaymentMethodId] =
    if (
      value.nonEmpty &&
      value.forall { char =>
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char == '_'
      }
    ) Some(new PaymentMethodId(value))
    else None

  implicit val decoder: Decoder[PaymentMethodId] = Decoder.decodeString.emap { str =>
    apply(str).toRight(s"PaymentMethodId $str had invalid characters")
  }
  implicit val encoder: Encoder[PaymentMethodId] = Encoder.encodeString.contramap[PaymentMethodId](_.value)

}
case class PaymentMethodId private (value: String) extends AnyVal

case class DirectDebitPaymentFields(
    accountHolderName: String,
    sortCode: String,
    accountNumber: String,
    recaptchaToken: String,
) extends PaymentFields

case class SepaPaymentFields(
    accountHolderName: String,
    iban: String,
    country: Option[String],
    streetName: Option[String],
) extends PaymentFields

case class ExistingPaymentFields(billingAccountId: String) extends PaymentFields

case class AmazonPayPaymentFields(amazonPayBillingAgreementId: String) extends PaymentFields

object PaymentFields {
  // Payment fields are input from support-frontend
  implicit val payPalPaymentFieldsCodec: Codec[PayPalPaymentFields] = deriveCodec
  implicit val stripeSourcePaymentFieldsCodec: Codec[StripeSourcePaymentFields] = deriveCodec
  implicit val stripePaymentMethodPaymentFieldsCodec: Codec[StripePaymentMethodPaymentFields] = deriveCodec
  implicit val directDebitPaymentFieldsCodec: Codec[DirectDebitPaymentFields] = deriveCodec
  implicit val sepaPaymentFieldsCodec: Codec[SepaPaymentFields] = deriveCodec
  implicit val existingPaymentFieldsCodec: Codec[ExistingPaymentFields] = deriveCodec
  implicit val amazonPayPaymentFieldsCodec: Codec[AmazonPayPaymentFields] = deriveCodec

  implicit val encodePaymentFields: Encoder[PaymentFields] = Encoder.instance {
    case p: PayPalPaymentFields => p.asJson
    case s: StripeSourcePaymentFields => s.asJson
    case s: StripePaymentMethodPaymentFields => s.asJson
    case d: DirectDebitPaymentFields => d.asJson
    case s: SepaPaymentFields => s.asJson.deepDropNullValues
    case e: ExistingPaymentFields => e.asJson
    case a: AmazonPayPaymentFields => a.asJson
  }

  implicit val decodePaymentFields: Decoder[PaymentFields] =
    List[Decoder[PaymentFields]](
      Decoder[PayPalPaymentFields].widen,
      Decoder[StripeSourcePaymentFields].widen,
      Decoder[StripePaymentMethodPaymentFields].widen,
      Decoder[DirectDebitPaymentFields].widen,
      Decoder[SepaPaymentFields].widen,
      Decoder[ExistingPaymentFields].widen,
      Decoder[AmazonPayPaymentFields].widen,
    ).reduceLeft(or(_, _))

  final def or[A, AA >: A](a: Decoder[A], d: => Decoder[AA]): Decoder[AA] = new Decoder[AA] {
    final def apply(c: HCursor): Decoder.Result[AA] = a(c) match {
      case r @ Right(_) => r
      case Left(err) =>
        d(c).left.map { decodingFailure: DecodingFailure =>
          DecodingFailure(err.message + " OR " + decodingFailure.message, err.history ++ decodingFailure.history)
        }
    }
  }

}
