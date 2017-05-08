package com.gu.zuora.model

import com.gu.i18n.Country

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
  `type`: String = "CreditCardReferenceTransaction") extends PaymentMethod

case class PayPalPaymentMethod(PaypalBaid: String,
  paypalEmail: String,
  paypalType: String = "ExpressCheckout",
  `type`: String = "PayPal") extends PaymentMethod
