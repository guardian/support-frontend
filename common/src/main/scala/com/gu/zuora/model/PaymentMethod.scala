package com.gu.zuora.model

import com.gu.i18n.Country

sealed trait PaymentMethod {
  def Type: String
}

case class CreditCardReferenceTransaction(TokenId: String, //Stripe Card id
  SecondTokenId: String, //Stripe Customer Id
  CreditCardNumber: String,
  CreditCardCountry: Option[Country],
  CreditCardExpirationMonth: Int,
  CreditCardExpirationYear: Int,
  CreditCardType: String /*TODO: strip spaces?*/ ,
  Type: String = "CreditCardReferenceTransaction") extends PaymentMethod

case class PayPalPaymentMethod(PaypalBaid: String,
  PaypalEmail: String,
  PaypalType: String = "ExpressCheckout",
  Type: String = "PayPal") extends PaymentMethod
