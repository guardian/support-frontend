package com.gu.zuora

import com.gu.i18n.{Country, Currency}
import com.gu.zuora.model.{CreditCardReferenceTransaction, PayPalPaymentMethod, PaymentGateway, PaymentMethod}
import io.circe._
import io.circe.generic.semiauto._
import org.joda.time.LocalDate

//Implementing this as a trait which can be mixed in because IntelliJ incorrectly marks the import
//as unused (resulting in it getting removed when optimising imports) if we make it an object and then import it.
trait CustomCodecs {
  //Encodes a Currency as its iso code eg. {"Currency": "GBP"}
  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)
  implicit val encodePaymentGateway: Encoder[PaymentGateway] = Encoder.encodeString.contramap[PaymentGateway](_.name)
  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)

  //We need to serialise PaymentMethod using the subtype to avoid nesting (see CirceEncodingBehaviourSpec)
  implicit val encodePaymentMethod: Encoder[PaymentMethod] = new Encoder[PaymentMethod]{
    override final def apply(a: PaymentMethod) = a match {
      case p: PayPalPaymentMethod => deriveEncoder[PayPalPaymentMethod].apply(p)
      case c: CreditCardReferenceTransaction => deriveEncoder[CreditCardReferenceTransaction].apply(c)
    }
  }

  //Encode joda LocalDate to the format expected by Zuora
  implicit val encodeLocalTime: Encoder[LocalDate] = Encoder.encodeString.contramap[LocalDate](_.toString("yyyy-MM-dd"))

}