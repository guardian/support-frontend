package codecs

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model._
import io.circe.{Decoder, Encoder, Json}
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.Contribution
import com.gu.support.workers.model.states.{CreatePaymentMethodState, FailureHandlerState}
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto._
import cats.syntax.functor._
import shapeless.Lazy
import com.gu.support.workers.model.Status
import ophan.thrift.event.{AbTest, AcquisitionSource}
import com.gu.fezziwig.CirceScroogeMacros.{decodeThriftEnum, decodeThriftStruct, encodeThriftEnum, encodeThriftStruct}
import ophan.thrift.componentEvent.ComponentType
import switchboard.{PaymentMethodsSwitch, ExperimentSwitch, Group, Segment, SwitchState, Switches}
import services.{PaymentApiError, PayPalError}

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
  implicit val failureHandlerStateCodec: Codec[FailureHandlerState] = deriveCodec
  implicit val switchStateEncode: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState](_.toString)
  implicit val switchStateDecode: Decoder[SwitchState] = deriveDecoder
  implicit val paymentMethodsSwitchCodec: Codec[PaymentMethodsSwitch] = deriveCodec
  implicit val segmentEncoder: Encoder[Segment] = Encoder.encodeString.contramap[Segment](_.toString)
  implicit val segmentDecoder: Decoder[Segment] = deriveDecoder
  implicit val experimentSwitchCodec: Codec[ExperimentSwitch] = deriveCodec
  implicit val switchesCodec: Codec[Switches] = deriveCodec

  private implicit val paypalApiErrorDecoder: Decoder[PayPalError] = deriveDecoder
  implicit val paymentApiError: Decoder[PaymentApiError] = deriveDecoder
}

