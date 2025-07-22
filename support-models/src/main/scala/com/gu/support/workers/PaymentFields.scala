package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Country
import com.gu.support.encoding.{Codec, CodecHelpers, DiscriminatedType}
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.PaymentFields.discriminatedType
import io.circe.syntax._
import io.circe.{Encoder, _}

sealed trait PaymentFields {
  def describe: String = getClass.getSimpleName.replaceAll("PaymentFields", "")
}

case class PayPalPaymentFields(baid: String) extends PaymentFields

case class StripeHostedPaymentFields(
    checkoutSessionId: Option[String],
    stripePublicKey: StripePublicKey,
) extends PaymentFields

case class StripePaymentFields(
    paymentMethod: PaymentMethodId,
    stripePaymentType: Option[StripePaymentType],
    stripePublicKey: StripePublicKey,
) extends PaymentFields {
  override def describe: String =
    stripePaymentType.map(_.getClass.getSimpleName.replaceAll("\\$", "")).getOrElse("Stripe")
}

object StripePublicKey {

  def parse(value: String): Either[String, StripePublicKey] =
    if (
      value.length > 10 &&
      value.startsWith("pk_") &&
      value.forall { char =>
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char == '_'
      }
    ) Right(new StripePublicKey(value))
    else Left(s"StripePublicKey <$value> had invalid characters")

  def get(value: String): StripePublicKey =
    parse(value).left.map(new Throwable(_)).toTry.get // Try.get will rethrow the useful error

  implicit val decoder: Decoder[StripePublicKey] = Decoder.decodeString.emap(parse)
  implicit val encoder: Encoder[StripePublicKey] = Encoder.encodeString.contramap[StripePublicKey](_.rawPublicKey)

}
case class StripePublicKey private (rawPublicKey: String) extends AnyVal

object StripeSecretKey {

  def parse(value: String): Either[String, StripeSecretKey] =
    if (
      value.length > 10 &&
      (value.startsWith("sk_") || value.startsWith("rk_")) &&
      value.forall { char =>
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char == '_'
      }
    ) Right(new StripeSecretKey(value))
    else if (value == "unused")
      Right(
        new StripeSecretKey(value),
      ) // TODO remove once we have deleted all support-frontend stripe api.config. from parameter store
    else Left(s"StripeSecretKey <$value> had invalid characters")

  def get(value: String): StripeSecretKey =
    parse(value).left.map(new Throwable(_)).toTry.get // Try.get will rethrow the useful error

  implicit val decoder: Decoder[StripeSecretKey] = Decoder.decodeString.emap(parse)
  implicit val encoder: Encoder[StripeSecretKey] = Encoder.encodeString.contramap[StripeSecretKey](_.secret)

}
case class StripeSecretKey private (secret: String) extends AnyVal

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

object PaymentFields {
  val discriminatedType = new DiscriminatedType[PaymentFields]("paymentType")

  // Payment fields are input from support-frontend
  implicit val payPalPaymentFieldsCodec: discriminatedType.VariantCodec[PayPalPaymentFields] =
    discriminatedType.variant[PayPalPaymentFields]("PayPal")
  implicit val stripePaymentMethodPaymentFieldsCodec: discriminatedType.VariantCodec[StripePaymentFields] =
    discriminatedType.variant[StripePaymentFields]("Stripe")
  implicit val stripeHostedPaymentFieldsCodec: discriminatedType.VariantCodec[StripeHostedPaymentFields] =
    discriminatedType.variant[StripeHostedPaymentFields]("StripeHostedCheckout")
  implicit val directDebitPaymentFieldsCodec: discriminatedType.VariantCodec[DirectDebitPaymentFields] =
    discriminatedType.variant[DirectDebitPaymentFields]("DirectDebit")
  implicit val sepapaymentFieldsCodec: discriminatedType.VariantCodec[SepaPaymentFields] =
    discriminatedType.variant[SepaPaymentFields]("Sepa")
  implicit val paymentFieldsCodec: Codec[PaymentFields] = discriminatedType.codec(
    List(
      payPalPaymentFieldsCodec,
      stripePaymentMethodPaymentFieldsCodec,
      directDebitPaymentFieldsCodec,
      sepapaymentFieldsCodec,
      stripeHostedPaymentFieldsCodec,
    ),
  )
}
