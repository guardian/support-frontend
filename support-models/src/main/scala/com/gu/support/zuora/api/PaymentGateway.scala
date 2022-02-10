package com.gu.support.zuora.api

import com.gu.i18n.Currency
import com.gu.i18n.Currency.AUD
import com.gu.support.workers.{
  CreditCardReferenceTransaction,
  DirectDebitPaymentMethod,
  PayPalReferenceTransaction,
  PaymentMethod,
}
import com.gu.support.workers._
import io.circe.{Decoder, Encoder}

import scala.PartialFunction.condOpt

//Payment gateways are used by Zuora to talk to the individual payment providers: Stripe, PayPal and GoCardless
sealed trait PaymentGateway {
  def name: String
}

object PaymentGateway {

  def fromString(s: String): Option[PaymentGateway] = condOpt(s) {
    case StripeGatewayDefault.name => StripeGatewayDefault
    case StripeGatewayAUD.name => StripeGatewayAUD
    case PayPalGateway.name => PayPalGateway
    case DirectDebitGateway.name => DirectDebitGateway
    case SepaGateway.name => SepaGateway
    case ZuoraInstanceDirectDebitGateway.name => ZuoraInstanceDirectDebitGateway
    case StripeGatewayPaymentIntentsDefault.name => StripeGatewayPaymentIntentsDefault
    case StripeGatewayPaymentIntentsAUD.name => StripeGatewayPaymentIntentsAUD
    case AmazonPayGatewayUSA.name => AmazonPayGatewayUSA
  }

  implicit val encoder: Encoder[PaymentGateway] = Encoder.encodeString.contramap[PaymentGateway](_.name)
  implicit val decoder: Decoder[PaymentGateway] =
    Decoder.decodeString.emap[PaymentGateway](s => PaymentGateway.fromString(s).toRight(s"Invalid payment gateway $s"))
}

//Gateway names need to match to those set in Zuora
//See: https://apisandbox.zuora.com/apps/NewGatewaySetting.do?method=list
case object StripeGatewayDefault extends PaymentGateway {
  val name = "Stripe Gateway 1"
}

case object StripeGatewayAUD extends PaymentGateway {
  val name = "Stripe Gateway GNM Membership AUS"
}

case object StripeGatewayPaymentIntentsDefault extends PaymentGateway {
  val name = "Stripe PaymentIntents GNM Membership"
}

case object StripeGatewayPaymentIntentsAUD extends PaymentGateway {
  val name = "Stripe PaymentIntents GNM Membership AUS"
}

case object PayPalGateway extends PaymentGateway {
  val name = "PayPal Express"
}

case object DirectDebitGateway extends PaymentGateway {
  val name = "GoCardless"
}

case object SepaGateway extends PaymentGateway {
  val name = "Stripe Bank Transfer - GNM Membership"
}

case object ZuoraInstanceDirectDebitGateway extends PaymentGateway {
  // not sure why there are two GoCardless gateways in Zuora - but having it declared here allows it be re-used
  val name = "GoCardless - Zuora Instance"
}

case object AmazonPayGatewayUSA extends PaymentGateway {
  val name = "Amazon Pay - Contributions USA"
}
