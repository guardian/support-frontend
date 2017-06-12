package com.gu.support.workers.model.monthlyContributions

import com.gu.i18n.Currency

case class Contribution(
  amount: BigDecimal,
  currency: Currency
)
