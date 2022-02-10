package com.gu.support.workers

import cats.syntax.functor._
import com.gu.i18n.Country
import com.gu.i18n.Country.UK
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.zuora.api.{DirectDebitGateway, PayPalGateway, PaymentGateway, SepaGateway}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

sealed trait PaymentMethod {
  def Type: String
  def PaymentGateway: PaymentGateway
}

sealed trait StripePaymentType

object StripePaymentType {
  case object StripeCheckout extends StripePaymentType
  case object StripeApplePay extends StripePaymentType
  case object StripePaymentRequestButton extends StripePaymentType

  implicit val stripePaymentTypeDecoder: Decoder[StripePaymentType] = Decoder.decodeString.map(code => fromString(code))
  implicit val stripePaymentTypeEncoder: Encoder[StripePaymentType] =
    Encoder.encodeString.contramap[StripePaymentType](_.toString)

  private def fromString(s: String) = {
    s match {
      case "StripePaymentRequestButton" => StripePaymentRequestButton
      case "StripeApplePay" => StripeApplePay
      case _ => StripeCheckout
    }
  }
}

case class CreditCardReferenceTransaction(
    TokenId: String, // Stripe Card id
    SecondTokenId: String, // Stripe Customer Id
    CreditCardNumber: String,
    CreditCardCountry: Option[Country],
    CreditCardExpirationMonth: Int,
    CreditCardExpirationYear: Int,
    CreditCardType: Option[String] /*TODO: strip spaces?*/,
    PaymentGateway: PaymentGateway,
    Type: String = "CreditCardReferenceTransaction",
    StripePaymentType: Option[StripePaymentType],
) extends PaymentMethod

case class PayPalReferenceTransaction(
    PaypalBaid: String,
    PaypalEmail: String,
    PaypalType: String = "ExpressCheckout",
    Type: String = "PayPal",
    PaymentGateway: PaymentGateway = PayPalGateway,
) extends PaymentMethod

case class DirectDebitPaymentMethod(
    FirstName: String,
    LastName: String,
    BankTransferAccountName: String,
    BankCode: String,
    BankTransferAccountNumber: String,
    Country: Country = UK,
    City: Option[String],
    PostalCode: Option[String],
    State: Option[String],
    StreetName: Option[String],
    StreetNumber: Option[String],
    BankTransferType: String = "DirectDebitUK",
    Type: String = "BankTransfer",
    PaymentGateway: PaymentGateway = DirectDebitGateway,
) extends PaymentMethod

case class ClonedDirectDebitPaymentMethod(
    ExistingMandate: String = "Yes",
    TokenId: String,
    MandateId: String,
    FirstName: String,
    LastName: String,
    BankTransferAccountName: String,
    BankCode: String,
    BankTransferAccountNumber: String,
    Country: Country = UK,
    BankTransferType: String = "DirectDebitUK",
    Type: String = "BankTransfer",
    PaymentGateway: PaymentGateway = DirectDebitGateway,
) extends PaymentMethod

case class GatewayOption(name: String, value: String)
case class GatewayOptionData(GatewayOption: List[GatewayOption])
case class SepaPaymentMethod(
    BankTransferAccountName: String,
    BankTransferAccountNumber: String,
    Email: String,
    IPAddress: String,
    GatewayOptionData: GatewayOptionData,
    BankTransferType: String = "SEPA",
    `Type`: String = "BankTransfer",
    PaymentGateway: PaymentGateway = SepaGateway,
) extends PaymentMethod

case class AmazonPayPaymentMethod(
    TokenId: String,
    Type: String = "CreditCardReferenceTransaction", // This is how amazon pay works in zuora - as a credit card
    PaymentGateway: PaymentGateway,
) extends PaymentMethod

object PaymentMethod {
  import io.circe.generic.auto._
  import com.gu.support.encoding.CustomCodecs.{decodeCountry, encodeCountryAsAlpha2}
  implicit val payPalReferenceTransactionCodec: Codec[PayPalReferenceTransaction] = deriveCodec
  implicit val creditCardReferenceTransactionCodec: Codec[CreditCardReferenceTransaction] = deriveCodec
  implicit val directDebitPaymentMethodCodec: Codec[DirectDebitPaymentMethod] = deriveCodec
  implicit val sepaPaymentMethodCodec: Codec[SepaPaymentMethod] = deriveCodec
  implicit val clonedDirectDebitPaymentMethodCodec: Codec[ClonedDirectDebitPaymentMethod] = deriveCodec
  implicit val amazonPayPaymentMethodCodec: Codec[AmazonPayPaymentMethod] = deriveCodec

  // Payment Methods are details from the payment provider
  implicit val encodePaymentMethod: Encoder[PaymentMethod] = Encoder.instance {
    case pp: PayPalReferenceTransaction => pp.asJson
    case card: CreditCardReferenceTransaction => card.asJson
    case dd: DirectDebitPaymentMethod => dd.asJson
    case sepa: SepaPaymentMethod => sepa.asJson
    case clonedDD: ClonedDirectDebitPaymentMethod => clonedDD.asJson
    case amazonPayPaymentMethod: AmazonPayPaymentMethod => amazonPayPaymentMethod.asJson
  }

  implicit val decodePaymentMethod: Decoder[PaymentMethod] =
    List[Decoder[PaymentMethod]](
      Decoder[PayPalReferenceTransaction].widen,
      Decoder[CreditCardReferenceTransaction].widen,
      Decoder[ClonedDirectDebitPaymentMethod].widen, // ordering is significant (at least between direct debit variants)
      Decoder[DirectDebitPaymentMethod].widen,
      Decoder[SepaPaymentMethod].widen,
      Decoder[AmazonPayPaymentMethod].widen,
    ).reduceLeft(_ or _)
}
