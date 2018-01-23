package com.gu.support.workers.model

sealed trait PaymentFields

case class PayPalPaymentFields(baid: String) extends PaymentFields

case class StripePaymentFields(userId: String, stripeToken: String) extends PaymentFields

case class DirectDebitPaymentFields(accountHolderName: String, sortCode: String, accountNumber: String) extends PaymentFields