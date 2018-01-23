package com.gu.zuora.model

import com.gu.support.workers.model._
import io.circe.{Decoder, Encoder}

import scala.PartialFunction.condOpt

//Payment gateways are used by Zuora to talk to the individual payment providers: Stripe, PayPal and GoCardless
sealed trait PaymentGateway {
  def name: String
}

object PaymentGateway {
  def forPaymentMethod(paymentMethod: PaymentMethod): PaymentGateway = paymentMethod match {
    case _: PayPalReferenceTransaction => PayPalGateway
    case _: CreditCardReferenceTransaction => StripeGateway
    case _: DirectDebitPaymentMethod => DirectDebitGateway
  }

  def fromString(s: String): Option[PaymentGateway] = condOpt(s) {
    case StripeGateway.name => StripeGateway
    case PayPalGateway.name => PayPalGateway
    case DirectDebitGateway.name => DirectDebitGateway
  }

  implicit val ecoder: Encoder[PaymentGateway] = Encoder.encodeString.contramap[PaymentGateway](_.name)
  implicit val decoder: Decoder[PaymentGateway] =
    Decoder.decodeString.emap[PaymentGateway](s => PaymentGateway.fromString(s).toRight(s"Invalid payment gateway $s"))
}

//Gateway names need to match to those set in Zuora
//See: https://apisandbox.zuora.com/apps/NewGatewaySetting.do?method=list
case object StripeGateway extends PaymentGateway {
  val name = "Stripe Gateway 1"
}

case object PayPalGateway extends PaymentGateway {
  val name = "PayPal Express"
}

case object DirectDebitGateway extends PaymentGateway {
  val name = "GoCardless"
}

