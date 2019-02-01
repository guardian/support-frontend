package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.capitalizingCodec
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

sealed trait PaymentMethod {
  def `type`: String
}

case class CreditCardReferenceTransaction(
  tokenId: String, //Stripe Card id
  secondTokenId: String, //Stripe Customer Id
  creditCardNumber: String,
  creditCardCountry: Option[Country],
  creditCardExpirationMonth: Int,
  creditCardExpirationYear: Int,
  creditCardType: String /*TODO: strip spaces?*/ ,
  `type`: String = "CreditCardReferenceTransaction"
) extends PaymentMethod

case class PayPalReferenceTransaction(
  paypalBaid: String,
  paypalEmail: String,
  paypalType: String = "ExpressCheckout",
  `type`: String = "PayPal"
) extends PaymentMethod

case class DirectDebitPaymentMethod(
  firstName: String,
  lastName: String,
  bankTransferAccountName: String,
  bankCode: String,
  bankTransferAccountNumber: String,
  country: Country = Country.UK,
  city: Option[String],
  postalCode: Option[String],
  state: Option[String],
  streetName: Option[String],
  streetNumber: Option[String],
  bankTransferType: String = "DirectDebitUK",
  `type`: String = "BankTransfer"
) extends PaymentMethod

object PaymentMethod {
  import com.gu.support.encoding.CustomCodecs.{decodeCountry, encodeCountryAsAlpha2}
  implicit val payPalReferenceTransactionCodec: Codec[PayPalReferenceTransaction] = capitalizingCodec
  implicit val creditCardReferenceTransactionCodec: Codec[CreditCardReferenceTransaction] = capitalizingCodec
  implicit val directDebitPaymentMethodCodec: Codec[DirectDebitPaymentMethod] = capitalizingCodec

  //Payment Methods are details from the payment provider
  implicit val encodePaymentMethod: Encoder[PaymentMethod] = Encoder.instance {
    case p: PayPalReferenceTransaction => p.asJson
    case c: CreditCardReferenceTransaction => c.asJson
    case d: DirectDebitPaymentMethod => d.asJson
  }

  implicit val decodePaymentMethod: Decoder[PaymentMethod] =
    List[Decoder[PaymentMethod]](
      Decoder[PayPalReferenceTransaction].widen,
      Decoder[CreditCardReferenceTransaction].widen,
      Decoder[DirectDebitPaymentMethod].widen
    ).reduceLeft(_ or _)
}
