package com.gu.support.workers.lambdas

import com.gu.support.workers.model.{CreditCardReferenceTransaction, DirectDebitPaymentMethod, PayPalReferenceTransaction, PaymentMethod}

object PaymentMethodExtensions {
  implicit class PaymentMethodExtension[T <: PaymentMethod](self: T) {
    def toFriendlyString: String = self match {
      case _: CreditCardReferenceTransaction => "Stripe"
      case _: PayPalReferenceTransaction => "PayPal"
      case _: DirectDebitPaymentMethod => "DirectDebit"
    }
  }
}
