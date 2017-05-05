package com.gu.zuora.model

sealed trait PaymentGateway {
  def name : String
}

case object StripeGateway extends PaymentGateway {
  val name = "Stripe Gateway 1"
}
case object PayPalGateway extends PaymentGateway{
  val name = "PayPal Express"
}

