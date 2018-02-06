package com.gu.support.workers.model

import com.gu.i18n.Currency

sealed trait ProductType {
  def currency: Currency
  def period: BillingPeriod

  override def toString: String = this.getClass.getSimpleName
  def describe: String
}

case class Contribution(
  currency: Currency,
  period: BillingPeriod,
  amount: BigDecimal
) extends ProductType {
  override def describe: String = s"$period-Contribution-$currency-$amount"
}

case class DigitalBundle(
  currency: Currency,
  period: BillingPeriod
) extends ProductType {
  override def describe: String = s"$period-DigitalBundle-$currency"
}