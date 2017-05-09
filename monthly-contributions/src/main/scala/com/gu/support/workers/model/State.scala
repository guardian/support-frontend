package com.gu.support.workers.model

import com.gu.salesforce.Salesforce.SalesforceContactRecord
import com.gu.zuora.model.PaymentMethod

case class CreatePaymentMethodState(user: User, amount: BigDecimal, paymentFields: Either[StripePaymentFields, PayPalPaymentFields])

case class CreateSalesforceContactState(user: User, amount: BigDecimal, paymentMethod: PaymentMethod)

case class CreateZuoraSubscriptionState(user: User, amount: BigDecimal, paymentMethod: PaymentMethod, salesForceContact: SalesforceContactRecord)