package codecs

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model.{Contribution, PayPalPaymentFields, StripePaymentFields, User}
import io.circe.{Decoder, Encoder, Json}
import cats.implicits._
import com.gu.support.workers.model.state.CreatePaymentMethodState
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto._
import services.stepfunctions.StripePaymentToken
import shapeless.Lazy

object CirceDecoders {
  type PaymentFields = Either[StripePaymentFields, PayPalPaymentFields]

  def deriveCodec[A](implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedObjectEncoder[A]]): Codec[A] =
    new Codec(deriveEncoder, deriveDecoder)

  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)

  implicit val decodeCurrency: Decoder[Currency] =
    Decoder.decodeString.emap { code => Currency.fromString(code).toRight(s"Unrecognised currency code '$code'") }

  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)

  implicit val decodeCountry: Decoder[Country] =
    Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }

  implicit val encodePaymentFields: Encoder[PaymentFields] = new Encoder[PaymentFields] {
    val stripeEncoder = deriveEncoder[StripePaymentFields]
    val paypalEncoder = deriveEncoder[PayPalPaymentFields]
    override def apply(a: PaymentFields): Json = {
      a.fold(stripeEncoder.apply, paypalEncoder.apply)
    }
  }

  implicit val paymentFields: Decoder[PaymentFields] = {
    val stripeFields = deriveDecoder[StripePaymentFields].map(_.asLeft[PayPalPaymentFields])
    val payPalFields = deriveDecoder[PayPalPaymentFields].map(_.asRight[StripePaymentFields])
    stripeFields or payPalFields
  }

  implicit val requestPaymentFields: Decoder[Either[StripePaymentToken, PayPalPaymentFields]] = {
    val stripeFields = deriveDecoder[StripePaymentToken].map(_.asLeft[PayPalPaymentFields])
    val payPalFields = deriveDecoder[PayPalPaymentFields].map(_.asRight[StripePaymentToken])
    stripeFields or payPalFields
  }

  implicit val userCodec: Codec[User] = deriveCodec
  implicit val contributionCodec: Codec[Contribution] = deriveCodec
  implicit val createPaymentMethodStateCodec: Codec[CreatePaymentMethodState] = deriveCodec
}
