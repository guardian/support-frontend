package com.gu.paypal

// Payment token used to tie PayPal requests together.
case class Token(token: String)

case class PayPalBillingDetails(amount: Float, billingPeriod: String, currency: String, tier: String)
