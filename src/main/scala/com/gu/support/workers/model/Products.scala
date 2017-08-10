package com.gu.support.workers.model
import com.gu.i18n.Currency

sealed trait Product

case class Contribution(
  amount: BigDecimal,
  currency: Currency,
  period: Period
) extends Product


case class DigitalBundle(
  currency: Currency,
  period: Period
) extends Product