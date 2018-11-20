package codecs

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model._
import io.circe.{Decoder, Encoder, Json}
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.Contribution
import com.gu.support.workers.model.states.{CheckoutFailureState, CreatePaymentMethodState}
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto._
import cats.syntax.functor._
import shapeless.Lazy
import com.gu.support.workers.model.Status
import ophan.thrift.event.{AbTest, AcquisitionSource}
import com.gu.fezziwig.CirceScroogeMacros.{decodeThriftEnum, decodeThriftStruct, encodeThriftEnum, encodeThriftStruct}
import com.gu.support.workers.model.CheckoutFailureReasons.CheckoutFailureReason
import ophan.thrift.componentEvent.ComponentType
import services.stepfunctions.StatusResponse
import admin._
import models.identity.responses.{SetGuestPasswordResponseCookie, SetGuestPasswordResponseCookies}
import services._
import org.joda.time.DateTime
import models.Catalog._

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

  //Payment fields are input from support-frontend
  implicit val payPalPaymentFieldsCodec: Codec[PayPalPaymentFields] = deriveCodec
  implicit val stripePaymentFieldsCodec: Codec[StripePaymentFields] = deriveCodec
  implicit val directDebitPaymentFieldsCodec: Codec[DirectDebitPaymentFields] = deriveCodec

  implicit val encodePaymentFields: Encoder[PaymentFields] = new Encoder[PaymentFields] {
    override final def apply(a: PaymentFields): Json = a match {
      case p: PayPalPaymentFields => Encoder[PayPalPaymentFields].apply(p)
      case s: StripePaymentFields => Encoder[StripePaymentFields].apply(s)
      case d: DirectDebitPaymentFields => Encoder[DirectDebitPaymentFields].apply(d)
    }
  }

  implicit val decodePaymentFields: Decoder[PaymentFields] = {
    List[Decoder[PaymentFields]](
      Decoder[PayPalPaymentFields].widen,
      Decoder[StripePaymentFields].widen,
      Decoder[DirectDebitPaymentFields].widen
    ).reduce(_ or _)
  }

  implicit val contributionCodec: Codec[Contribution] = deriveCodec
  implicit val digitalPackCodec: Codec[DigitalPack] = deriveCodec

  implicit val encodeProductType: Encoder[ProductType] = new Encoder[ProductType] {
    override final def apply(productType: ProductType): Json = productType match {
      case contribution: Contribution => Encoder[Contribution].apply(contribution)
      case digitalPack: DigitalPack => Encoder[DigitalPack].apply(digitalPack)
    }
  }

  implicit val decodeProductType: Decoder[ProductType] = {
    List[Decoder[ProductType]](
      Decoder[Contribution].widen,
      Decoder[DigitalPack].widen
    ).reduce(_ or _)
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
  implicit val createPaymentMethodStateCodec: Codec[CreatePaymentMethodState] = deriveCodec
  implicit val switchStateEncoder: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState](_.toString)
  implicit val switchStateDecoder: Decoder[SwitchState] = Decoder.decodeString.map(SwitchState.fromString)
  implicit val paymentMethodsSwitchCodec: Codec[PaymentMethodsSwitch] = deriveCodec
  implicit val segmentEncoder: Encoder[Segment] = Encoder.encodeString.contramap[Segment](_.toString)
  implicit val segmentDecoder: Decoder[Segment] = Decoder.decodeString.map(Segment.fromString)
  implicit val experimentSwitchCodec: Codec[ExperimentSwitch] = deriveCodec
  implicit val switchesCodec: Codec[Switches] = deriveCodec
  implicit val settingsCodec: Codec[Settings] = deriveCodec

  implicit val statusEncoder: Encoder[StatusResponse] = deriveEncoder
  implicit val decodeFailureReason: Decoder[CheckoutFailureReason] = Decoder.decodeString.emap {
    identifier => CheckoutFailureReasons.fromString(identifier).toRight(s"Unrecognised failure reason '$identifier'")
  }
  implicit val encodeFailureReason: Encoder[CheckoutFailureReason] = Encoder.encodeString.contramap[CheckoutFailureReason](_.asString)
  implicit val checkoutFailureStateCodec: Codec[CheckoutFailureState] = deriveCodec

  implicit val payPalErrorBodyDecoder: Decoder[PayPalError] = deriveDecoder
  implicit val payPalSuccessDecoder: Decoder[PayPalSuccess] = deriveDecoder

  implicit val pricingDecoder: Decoder[Pricing] = deriveDecoder
  implicit val pricingEncoder: Encoder[Pricing] = deriveEncoder

  implicit val chargeDecoder: Decoder[Charge] = deriveDecoder
  implicit val chargeEncoder: Encoder[Charge] = deriveEncoder

  implicit val productRatePlanDecoder: Decoder[ProductRatePlan] = deriveDecoder
  implicit val productRatePlanEncoder: Encoder[ProductRatePlan] = deriveEncoder

  implicit val productDecoder: Decoder[Product] = deriveDecoder
  implicit val productEncoder: Encoder[Product] = deriveEncoder

  implicit val catalogDecoder: Decoder[Catalog] = deriveDecoder
  implicit val catalogEncoder: Encoder[Catalog] = deriveEncoder

  implicit val paperPricesDecoder: Decoder[PaperPrices] = deriveDecoder
  implicit val paperPricesEncoder: Encoder[PaperPrices] = deriveEncoder

  implicit val pricePlanDecoder: Decoder[PricePlan] = deriveDecoder
  implicit val pricePlanEncoder: Encoder[PricePlan] = deriveEncoder

  implicit val dateTimeEncoder: Encoder[DateTime] = Encoder.encodeString.contramap(_.toString)
  implicit val cookieResponseEncoder: Encoder[SetGuestPasswordResponseCookie] = deriveEncoder
  implicit val cookiesResponseEncoder: Encoder[SetGuestPasswordResponseCookies] = deriveEncoder
  implicit val getUserTypeEncoder: Encoder[GetUserTypeResponse] = deriveEncoder
}
