package codecs

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model._
import io.circe.{Decoder, Encoder, Json}
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, CreatePaymentMethodState, FailureHandlerState}
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto._
import services.stepfunctions.StripePaymentToken
import shapeless.Lazy
import com.gu.support.workers.model.monthlyContributions.Status
import ophan.thrift.event.{AbTest, AcquisitionSource}
import cats.syntax.either._
import com.gu.fezziwig.CirceScroogeMacros.{decodeThriftEnum, decodeThriftStruct, encodeThriftEnum, encodeThriftStruct}
import ophan.thrift.componentEvent.ComponentType

object CirceDecoders {

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
    private val directDebitEncoder = deriveEncoder[DirectDebitPaymentFields]

    override def apply(a: PaymentFields): Json = {
      a match {
        case p: PayPalPaymentFields => paypalEncoder.apply(p)
        case s: StripePaymentFields => stripeEncoder.apply(s)
        case d: DirectDebitPaymentFields => directDebitEncoder.apply(d)
      }
    }
  }

  implicit val decodePaymentFields: Decoder[PaymentFields] = Decoder[PayPalPaymentFields].map(x => x: PaymentFields)
    .or(Decoder[StripePaymentFields].map(x => x: PaymentFields))
    .or(Decoder[DirectDebitPaymentFields].map(x => x: PaymentFields))

  implicit val requestPaymentFields: Decoder[Either[StripePaymentToken, PayPalPaymentFields]] = {
    val stripeFields = deriveDecoder[StripePaymentToken].map(_.asLeft[PayPalPaymentFields])
    val payPalFields = deriveDecoder[PayPalPaymentFields].map(_.asRight[StripePaymentToken])
    stripeFields or payPalFields
  }

  implicit val decodePeriod: Decoder[BillingPeriod] =
    Decoder.decodeString.emap(code => BillingPeriod.fromString(code).toRight(s"Unrecognised period code '$code'"))
  implicit val encodePeriod: Encoder[BillingPeriod] = Encoder.encodeString.contramap[BillingPeriod](_.toString)

  implicit val ophanIdsCodec: Codec[OphanIds] = deriveCodec
  implicit val abTestDecoder: Decoder[AbTest] = decodeThriftStruct[AbTest]
  implicit val abTestEncoder: Encoder[AbTest] = encodeThriftStruct[AbTest]

  implicit val componentTypeDecoder: Decoder[ComponentType] = decodeThriftEnum[ComponentType]
  implicit val componentTypeEncoder: Encoder[ComponentType] = encodeThriftEnum[ComponentType]

  implicit val acquisitionSourceDecoder: Decoder[AcquisitionSource] = decodeThriftEnum[AcquisitionSource]
  implicit val acquisitionSourceEncoder: Encoder[AcquisitionSource] = encodeThriftEnum[AcquisitionSource]

  implicit val acquisitionDataCodec: Codec[AcquisitionData] = deriveCodec

  implicit val referrerAcquisitionDataCodec: Codec[ReferrerAcquisitionData] = deriveCodec

  implicit val userCodec: Codec[User] = deriveCodec
  implicit val contributionCodec: Codec[Contribution] = deriveCodec
  implicit val createPaymentMethodStateCodec: Codec[CreatePaymentMethodState] = deriveCodec
  implicit val failureHandlerStateCodec: Codec[FailureHandlerState] = deriveCodec
  implicit val completedStateCodec: Codec[CompletedState] = deriveCodec
}

