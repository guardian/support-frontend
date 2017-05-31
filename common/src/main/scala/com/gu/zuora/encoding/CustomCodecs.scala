package com.gu.zuora.encoding

import java.util.UUID

import com.gu.helpers.StringExtensions._
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model.{Contribution, User, _}
import com.gu.zuora.encoding.CapitalizationEncoder._
import com.gu.zuora.model._
import io.circe._
import io.circe.generic.semiauto._
import org.joda.time.{DateTime, LocalDate}
import cats.syntax.either._
import scala.util.Try

object CustomCodecs extends CustomCodecs

trait CustomCodecs {
  //Request encoders
  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)

  implicit val decodeCurrency: Decoder[Currency] =
    Decoder.decodeString.emap { code => Currency.fromString(code).toRight(s"Unrecognised currency code '$code'") }

  //Encodes a Currency as its iso code eg. {"Currency": "GBP"}
  implicit val encodePaymentGateway: Encoder[PaymentGateway] = Encoder.encodeString.contramap[PaymentGateway](_.name)
  implicit val decodePaymentGateway: Decoder[PaymentGateway] =
    Decoder.decodeString.emap[PaymentGateway](s => PaymentGateway.fromString(s).toRight(s"Invalid payment gateway $s"))
  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)

  //Account object encoding - unfortunately the custom field name of the Salesforce contact id starts with a lower case
  //letter whereas all the other fields start with upper case so we need to set it explicitly
  private val salesforceIdName = "sfContactId__c"

  private def decapitalizeSfContactId(fieldName: String) =
    if (fieldName == salesforceIdName.capitalize) salesforceIdName.decapitalize
    else fieldName

  implicit val encodeAccount: Encoder[Account] = capitalizingEncoder[Account].mapJsonObject(modifyFields(_)(decapitalizeSfContactId))
  implicit val decodeAccount: Decoder[Account] = decapitalizingDecoder[Account]

  implicit val encodeSubscribeOptions: Encoder[SubscribeOptions] = capitalizingEncoder[SubscribeOptions]
  implicit val decodeSubscribeOptions: Decoder[SubscribeOptions] = decapitalizingDecoder[SubscribeOptions]
  implicit val encodeSubscribeResponseAccount: Encoder[SubscribeResponseAccount] = capitalizingEncoder[SubscribeResponseAccount]
  implicit val encodeInvoice: Encoder[Invoice] = capitalizingEncoder[Invoice]
  implicit val encodeInvoiceResult: Encoder[InvoiceResult] = capitalizingEncoder[InvoiceResult]
  implicit val encodeSubscriptionProductFeature: Encoder[SubscriptionProductFeature] = capitalizingEncoder[SubscriptionProductFeature]
  implicit val decodeSubscriptionProductFeature: Decoder[SubscriptionProductFeature] = decapitalizingDecoder[SubscriptionProductFeature]
  implicit val encodeRatePlanCharge: Encoder[RatePlanCharge] = capitalizingEncoder[RatePlanCharge]
  implicit val decodeRatePlanCharge: Decoder[RatePlanCharge] = decapitalizingDecoder[RatePlanCharge]
  implicit val encodeRatePlanChargeData: Encoder[RatePlanChargeData] = capitalizingEncoder[RatePlanChargeData]
  implicit val decodeRatePlanChargeData: Decoder[RatePlanChargeData] = decapitalizingDecoder[RatePlanChargeData]
  implicit val encodeRatePlan: Encoder[RatePlan] = capitalizingEncoder[RatePlan]
  implicit val decodeRatePlan: Decoder[RatePlan] = decapitalizingDecoder[RatePlan]
  implicit val encodeRatePlanData: Encoder[RatePlanData] = capitalizingEncoder[RatePlanData]
  implicit val decodeRatePlanData: Decoder[RatePlanData] = decapitalizingDecoder[RatePlanData]
  implicit val encodeSubscription: Encoder[Subscription] = capitalizingEncoder[Subscription]
  implicit val decodeSubscription: Decoder[Subscription] = decapitalizingDecoder[Subscription]
  implicit val encodeSubscriptionData: Encoder[SubscriptionData] = capitalizingEncoder[SubscriptionData]
  implicit val decodeSubscriptionData: Decoder[SubscriptionData] = decapitalizingDecoder[SubscriptionData]
  implicit val encodeContactDetails: Encoder[ContactDetails] = capitalizingEncoder[ContactDetails]
  implicit val decodeContactDetails: Decoder[ContactDetails] = decapitalizingDecoder[ContactDetails]
  implicit val encodeSubscribeItem: Encoder[SubscribeItem] = capitalizingEncoder[SubscribeItem]
  implicit val decodeSubscribeItem: Decoder[SubscribeItem] = decapitalizingDecoder[SubscribeItem]

  //We need to serialise PaymentMethod using the subtype to avoid nesting (see CirceEncodingBehaviourSpec)
  implicit val encodePayPalReferenceTransaction = capitalizingEncoder[PayPalReferenceTransaction]
  implicit val encodeCreditCardReferenceTransaction = capitalizingEncoder[CreditCardReferenceTransaction]

  implicit val encodePaymentMethod: Encoder[PaymentMethod] = new Encoder[PaymentMethod] {
    override final def apply(a: PaymentMethod) = a match {
      case p: PayPalReferenceTransaction => Encoder[PayPalReferenceTransaction].apply(p)
      case c: CreditCardReferenceTransaction => Encoder[CreditCardReferenceTransaction].apply(c)
    }
  }

  //Encode joda LocalDate to the format expected by Zuora
  implicit val encodeLocalTime: Encoder[LocalDate] = Encoder.encodeString.contramap(_.toString("yyyy-MM-dd"))
  implicit val decodeLocalTime: Decoder[LocalDate] = Decoder.decodeString.map(LocalDate.parse)
  implicit val encodeDateTime: Encoder[DateTime] = Encoder.encodeLong.contramap(_.getMillis)
  implicit val decodeDateTime: Decoder[DateTime] = Decoder.decodeLong.map(new DateTime(_))

  //response decoders
  implicit val decodePayPalReferenceTransaction: Decoder[PayPalReferenceTransaction] = decapitalizingDecoder[PayPalReferenceTransaction]
  implicit val decodeCreditCardReferenceTransaction: Decoder[CreditCardReferenceTransaction] = decapitalizingDecoder[CreditCardReferenceTransaction]
  implicit val decodePaymentMethod: Decoder[PaymentMethod] =
    Decoder[PayPalReferenceTransaction].map(x => x: PaymentMethod).or(
      Decoder[CreditCardReferenceTransaction].map(x => x: PaymentMethod)
    )

  implicit val decodeInvoice: Decoder[Invoice] = decapitalizingDecoder[Invoice]
  implicit val decodeInvoiceResult: Decoder[InvoiceResult] = decapitalizingDecoder[InvoiceResult]
  implicit val decodeSubscribeResponseAccount: Decoder[SubscribeResponseAccount] = decapitalizingDecoder[SubscribeResponseAccount]

  implicit val decodeCountry: Decoder[Country] =
    Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }

  type PaymentFields = Either[StripePaymentFields, PayPalPaymentFields]

  implicit val decodeStripeFields: Decoder[StripePaymentFields] = deriveDecoder
  implicit val decodePaymentFields: Decoder[PaymentFields] = {
    val stripeFields = deriveDecoder[StripePaymentFields].map(_.asLeft[PayPalPaymentFields])
    val payPalFields = deriveDecoder[PayPalPaymentFields].map(_.asRight[StripePaymentFields])
    stripeFields or payPalFields
  }

  implicit val userEncoder: Encoder[User] = deriveEncoder
  implicit val userDecoder: Decoder[User] = deriveDecoder

  implicit val contributionEncoder: Encoder[Contribution] = deriveEncoder
  implicit val contributionDecoder: Decoder[Contribution] = deriveDecoder

  implicit val uuidDecoder =
    Decoder.decodeString.emap { code => Try { UUID.fromString(code) }.toOption.toRight(s"Invalid UUID '$code'") }

  implicit val uuidEnecoder: Encoder[UUID] = Encoder.encodeString.contramap(_.toString)
}