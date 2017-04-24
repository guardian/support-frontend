package com.gu.zuora.soap.model

import com.gu.i18n.Country

sealed trait PaymentMethod
case class CreditCardReferenceTransaction(cardId: String, customerId: String, last4: String, cardCountry: Option[Country], expirationMonth: Int, expirationYear: Int, cardType: String) extends PaymentMethod
case class BankTransfer(accountHolderName: String, accountNumber: String, sortCode: String, firstName: String, lastName: String, countryCode: String) extends PaymentMethod
case class PayPalReferenceTransaction(baId: String, email: String) extends PaymentMethod

