package com.gu.zuora.model

sealed trait PaymentGateway {
  def name: String
}

object PaymentGateway {
  def forPaymentMethod(paymentMethod: PaymentMethod): PaymentGateway = paymentMethod match {
    case _: PayPalReferenceTransaction => PayPalGateway
    case _: CreditCardReferenceTransaction => StripeGateway
  }
}

case object StripeGateway extends PaymentGateway {
  val name = "Stripe Gateway 1"
}

case object PayPalGateway extends PaymentGateway {
  val name = "PayPal Express"
}

