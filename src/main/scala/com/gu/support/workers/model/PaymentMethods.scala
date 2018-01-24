package com.gu.support.workers.model

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
  `type`: String = "CreditCardReferenceTransaction"
) extends PaymentMethod

case class PayPalReferenceTransaction(
  paypalBaid: String,
  paypalEmail: String,
  paypalType: String = "ExpressCheckout",
  `type`: String = "PayPal"
) extends PaymentMethod

case class DirectDebitPaymentMethod(
  firstName: String,
  lastName: String,
  bankTransferAccountName: String,
  bankCode: String,
  bankTransferAccountNumber: String,
  country: Country = Country.UK,
  bankTransferType: String = "DirectDebitUK",
  `type`: String = "BankTransfer"
) extends PaymentMethod