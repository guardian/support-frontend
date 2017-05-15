package com.gu.support.workers.model

import com.gu.salesforce.Salesforce.SalesforceContactRecord
import com.gu.zuora.model.PaymentMethod

case class CreatePaymentMethodState(
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
)

case class CreateSalesforceContactState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod
)

case class CreateZuoraSubscriptionState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord)

case class SendThankYouEmailState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String
)
