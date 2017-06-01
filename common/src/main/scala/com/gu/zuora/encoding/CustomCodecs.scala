package com.gu.zuora.encoding

import java.util.UUID

import com.gu.helpers.StringExtensions._
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model._
import com.gu.zuora.encoding.CapitalizationEncoder._
import com.gu.zuora.model._
import io.circe._
import io.circe.generic.semiauto._
import org.joda.time.{DateTime, LocalDate}
import cats.syntax.either._
import scala.util.Try

object CustomCodecs extends CustomCodecs with ModelsCodecs with InternationalisationCodecs with HelperCodecs

trait InternationalisationCodecs {
  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)

  implicit val decodeCurrency: Decoder[Currency] =
    Decoder.decodeString.emap { code => Currency.fromString(code).toRight(s"Unrecognised currency code '$code'") }

  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)
  implicit val decodeCountry: Decoder[Country] =
    Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }
}

trait ModelsCodecs { self: CustomCodecs with InternationalisationCodecs with HelperCodecs =>
  type PaymentFields = Either[StripePaymentFields, PayPalPaymentFields]

  implicit val encodePayPalReferenceTransaction = capitalizingEncoder[PayPalReferenceTransaction]
  implicit val encodeCreditCardReferenceTransaction = capitalizingEncoder[CreditCardReferenceTransaction]
  implicit val encodePaymentMethod: Encoder[PaymentMethod] = new Encoder[PaymentMethod] {
    override final def apply(a: PaymentMethod) = a match {
      case p: PayPalReferenceTransaction => Encoder[PayPalReferenceTransaction].apply(p)
      case c: CreditCardReferenceTransaction => Encoder[CreditCardReferenceTransaction].apply(c)
    }
  }

  implicit val decodePayPalReferenceTransaction: Decoder[PayPalReferenceTransaction] = decapitalizingDecoder[PayPalReferenceTransaction]
  implicit val decodeCreditCardReferenceTransaction: Decoder[CreditCardReferenceTransaction] = decapitalizingDecoder[CreditCardReferenceTransaction]
  implicit val decodePaymentMethod: Decoder[PaymentMethod] =
    Decoder[PayPalReferenceTransaction].map(x => x: PaymentMethod).or(
      Decoder[CreditCardReferenceTransaction].map(x => x: PaymentMethod)
    )
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

}

trait HelperCodecs {
  implicit val encodeLocalTime: Encoder[LocalDate] = Encoder.encodeString.contramap(_.toString("yyyy-MM-dd"))
  implicit val decodeLocalTime: Decoder[LocalDate] = Decoder.decodeString.map(LocalDate.parse)
  implicit val encodeDateTime: Encoder[DateTime] = Encoder.encodeLong.contramap(_.getMillis)
  implicit val decodeDateTime: Decoder[DateTime] = Decoder.decodeLong.map(new DateTime(_))
  implicit val uuidDecoder =
    Decoder.decodeString.emap { code => Try { UUID.fromString(code) }.toOption.toRight(s"Invalid UUID '$code'") }

  implicit val uuidEnecoder: Encoder[UUID] = Encoder.encodeString.contramap(_.toString)
}

trait CustomCodecs {
  //Request encoders
  //Account object encoding - unfortunately the custom field name of the Salesforce contact id starts with a lower case
  //letter whereas all the other fields start with upper case so we need to set it explicitly
  private val salesforceIdName = "sfContactId__c"

  def decapitalizeSfContactId(fieldName: String): String =
    if (fieldName == salesforceIdName.capitalize) salesforceIdName.decapitalize
    else fieldName
}