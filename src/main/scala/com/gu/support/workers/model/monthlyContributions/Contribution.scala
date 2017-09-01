package com.gu.support.workers.model.monthlyContributions

import com.gu.i18n.Currency
import com.gu.support.workers.model.{BillingPeriod, Monthly}

case class Contribution(
  amount: BigDecimal,
  currency: Currency,
  billingPeriod: BillingPeriod = Monthly
)
