package codecs

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model.{BillingPeriod, PayPalPaymentFields, StripePaymentFields, User}
import io.circe.{Decoder, Encoder, Json}
import cats.implicits._
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, CreatePaymentMethodState, FailureHandlerState}
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto._
import services.stepfunctions.StripePaymentToken
import shapeless.Lazy
import com.gu.support.workers.model.monthlyContributions.Status

object CirceDecoders {
  type PaymentFields = Either[StripePaymentFields, PayPalPaymentFields]

  def deriveCodec[A](implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedObjectEncoder[A]]): Codec[A] =
    new Codec(deriveEncoder, deriveDecoder)

  implicit val encodeStatus: Encoder[Status] = Encoder.encodeString.contramap[Status](_.asString)

  implicit val decodeStatus: Decoder[Status] =
    Decoder.decodeString.emap { status => Status.fromString(status).toRight(s"Unrecognised status '$status'") }

  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)

  implicit val decodeCurrency: Decoder[Currency] =
    Decoder.decodeString.emap { code => Currency.fromString(code).toRight(s"Unrecognised currency code '$code'") }

  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)

  implicit val decodeCountry: Decoder[Country] =
    Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }

  implicit val encodePaymentFields: Encoder[PaymentFields] = new Encoder[PaymentFields] {
    private val stripeEncoder = deriveEncoder[StripePaymentFields]
    private val paypalEncoder = deriveEncoder[PayPalPaymentFields]
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

  implicit val decodePeriod: Decoder[BillingPeriod] =
    Decoder.decodeString.emap(code => BillingPeriod.fromString(code).toRight(s"Unrecognised period code '$code'"))
  implicit val encodePeriod: Encoder[BillingPeriod] = Encoder.encodeString.contramap[BillingPeriod](_.toString)

  implicit val userCodec: Codec[User] = deriveCodec
  implicit val contributionCodec: Codec[Contribution] = deriveCodec
  implicit val createPaymentMethodStateCodec: Codec[CreatePaymentMethodState] = deriveCodec
  implicit val failureHandlerStateCodec: Codec[FailureHandlerState] = deriveCodec
  implicit val completedStateCodec: Codec[CompletedState] = deriveCodec
}
