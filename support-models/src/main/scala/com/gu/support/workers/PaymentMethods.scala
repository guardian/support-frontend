package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.capitalizingCodec
import com.gu.support.zuora.api.{DirectDebitGateway, PayPalGateway, PaymentGateway}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

sealed trait PaymentMethod {
  def `type`: String
  def paymentGateway: PaymentGateway
}

case class CreditCardReferenceTransaction(
  tokenId: String, //Stripe Card id
  secondTokenId: String, //Stripe Customer Id
  creditCardNumber: String,
  creditCardCountry: Option[Country],
  creditCardExpirationMonth: Int,
  creditCardExpirationYear: Int,
  creditCardType: String /*TODO: strip spaces?*/ ,
  paymentGateway: PaymentGateway,
  `type`: String = "CreditCardReferenceTransaction"
) extends PaymentMethod

case class PayPalReferenceTransaction(
  paypalBaid: String,
  paypalEmail: String,
  paypalType: String = "ExpressCheckout",
  `type`: String = "PayPal",
  paymentGateway: PaymentGateway = PayPalGateway
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
  `type`: String = "BankTransfer",
  paymentGateway: PaymentGateway = DirectDebitGateway
) extends PaymentMethod

case class ClonedDirectDebitPaymentMethod(
  existingMandate: String = "Yes",
  tokenId: String,
  mandateId: String,
  firstName: String,
  lastName: String,
  bankTransferAccountName: String,
  bankCode: String,
  bankTransferAccountNumber: String,
  country: Country = Country.UK,
  bankTransferType: String = "DirectDebitUK",
  `type`: String = "BankTransfer",
  paymentGateway: PaymentGateway = DirectDebitGateway
) extends PaymentMethod

object PaymentMethod {
  import com.gu.support.encoding.CustomCodecs.{decodeCountry, encodeCountryAsAlpha2}
  implicit val payPalReferenceTransactionCodec: Codec[PayPalReferenceTransaction] = capitalizingCodec
  implicit val creditCardReferenceTransactionCodec: Codec[CreditCardReferenceTransaction] = capitalizingCodec
  implicit val directDebitPaymentMethodCodec: Codec[DirectDebitPaymentMethod] = capitalizingCodec
  implicit val clonedDirectDebitPaymentMethodCodec: Codec[ClonedDirectDebitPaymentMethod] = capitalizingCodec

  //Payment Methods are details from the payment provider
  implicit val encodePaymentMethod: Encoder[PaymentMethod] = Encoder.instance {
    case pp: PayPalReferenceTransaction => pp.asJson
    case card: CreditCardReferenceTransaction => card.asJson
    case dd: DirectDebitPaymentMethod => dd.asJson
    case clonedDD: ClonedDirectDebitPaymentMethod => clonedDD.asJson
  }

  implicit val decodePaymentMethod: Decoder[PaymentMethod] =
    List[Decoder[PaymentMethod]](
      Decoder[PayPalReferenceTransaction].widen,
      Decoder[CreditCardReferenceTransaction].widen,
      Decoder[ClonedDirectDebitPaymentMethod].widen, // ordering is significant (at least between direct debit variants)
      Decoder[DirectDebitPaymentMethod].widen
    ).reduceLeft(_ or _)
}
