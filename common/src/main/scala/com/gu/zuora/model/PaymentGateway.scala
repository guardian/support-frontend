package com.gu.zuora.model

import com.gu.support.workers.model.{CreditCardReferenceTransaction, PayPalReferenceTransaction, PaymentMethod}
import io.circe.{Decoder, Encoder}

import PartialFunction.condOpt

sealed trait PaymentGateway {
  def name: String
}

object PaymentGateway {
  def forPaymentMethod(paymentMethod: PaymentMethod): PaymentGateway = paymentMethod match {
    case _: PayPalReferenceTransaction => PayPalGateway
    case _: CreditCardReferenceTransaction => StripeGateway
  }

  def fromString(s: String): Option[PaymentGateway] = condOpt(s) {
    case StripeGateway.name => StripeGateway
    case PayPalGateway.name => PayPalGateway
  }

  implicit val ecoder: Encoder[PaymentGateway] = Encoder.encodeString.contramap[PaymentGateway](_.name)
  implicit val decoder: Decoder[PaymentGateway] =
    Decoder.decodeString.emap[PaymentGateway](s => PaymentGateway.fromString(s).toRight(s"Invalid payment gateway $s"))
}

case object StripeGateway extends PaymentGateway {
  val name = "Stripe Gateway 1"
}

case object PayPalGateway extends PaymentGateway {
  val name = "PayPal Express"
}

