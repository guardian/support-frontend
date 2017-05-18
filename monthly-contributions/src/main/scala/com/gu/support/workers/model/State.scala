package com.gu.support.workers.model

import com.gu.salesforce.Salesforce.SalesforceContactRecord
import com.gu.zuora.model.PaymentMethod

trait UserState {
  val user: User
}

case class CreatePaymentMethodState(
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
) extends UserState

case class CreateSalesforceContactState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod
) extends UserState

case class CreateZuoraSubscriptionState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord
) extends UserState

case class SendThankYouEmailState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String
) extends UserState
