package com.gu.zuora.encoding

import com.gu.i18n.{Country, Currency}
import com.gu.zuora.encoding.CapitalizationEncoder._
import com.gu.zuora.model._
import io.circe._
import org.joda.time.LocalDate

//Implementing this as a trait which can be mixed in because IntelliJ incorrectly marks the import
//as unused (resulting in it getting removed when optimising imports) if we make it an object and then import it.
trait CustomCodecs {
  //Request encoders
  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso) //Encodes a Currency as its iso code eg. {"Currency": "GBP"}
  implicit val encodePaymentGateway: Encoder[PaymentGateway] = Encoder.encodeString.contramap[PaymentGateway](_.name)
  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)
  implicit val encodeAccount: Encoder[Account] = capitalizingEncoder[Account]
  implicit val encodeSubscribeOptions: Encoder[SubscribeOptions] = capitalizingEncoder[SubscribeOptions]
  implicit val encodeSubscribeResponseAccount: Encoder[SubscribeResponseAccount] = capitalizingEncoder[SubscribeResponseAccount]
  implicit val encodeInvoice: Encoder[Invoice] = capitalizingEncoder[Invoice]
  implicit val encodeInvoiceResult: Encoder[InvoiceResult] = capitalizingEncoder[InvoiceResult]

  implicit val encodeSubscriptionProductFeature: Encoder[SubscriptionProductFeature] = capitalizingEncoder[SubscriptionProductFeature]
  implicit val encodeRatePlanCharge: Encoder[RatePlanCharge] = capitalizingEncoder[RatePlanCharge]
  implicit val encodeRatePlanChargeData: Encoder[RatePlanChargeData] = capitalizingEncoder[RatePlanChargeData]
  implicit val encodeRatePlan: Encoder[RatePlan] = capitalizingEncoder[RatePlan]
  implicit val encodeRatePlanData: Encoder[RatePlanData] = capitalizingEncoder[RatePlanData]

  implicit val encodeSubscription: Encoder[Subscription] = capitalizingEncoder[Subscription]
  implicit val encodeSubscriptionData: Encoder[SubscriptionData] = capitalizingEncoder[SubscriptionData]
  implicit val encodeContactDetails: Encoder[ContactDetails] = capitalizingEncoder[ContactDetails]
  implicit val encodeSubscribeItem: Encoder[SubscribeItem] = capitalizingEncoder[SubscribeItem]


  //We need to serialise PaymentMethod using the subtype to avoid nesting (see CirceEncodingBehaviourSpec)
  implicit val encodePaymentMethod: Encoder[PaymentMethod] = new Encoder[PaymentMethod] {
    override final def apply(a: PaymentMethod) = a match {
      case p: PayPalPaymentMethod => capitalizingEncoder[PayPalPaymentMethod].apply(p)
      case c: CreditCardReferenceTransaction => capitalizingEncoder[CreditCardReferenceTransaction].apply(c)
    }
  }

  //Encode joda LocalDate to the format expected by Zuora
  implicit val encodeLocalTime: Encoder[LocalDate] = Encoder.encodeString.contramap[LocalDate](_.toString("yyyy-MM-dd"))

  //response decoders
  implicit val decodeInvoice: Decoder[Invoice] = decapitalizingDecoder[Invoice]
  implicit val decodeInvoiceResult: Decoder[InvoiceResult] = decapitalizingDecoder[InvoiceResult]
  implicit val decodeSubscribeResponseAccount: Decoder[SubscribeResponseAccount] = decapitalizingDecoder[SubscribeResponseAccount]
}