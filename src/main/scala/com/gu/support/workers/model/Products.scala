package com.gu.support.workers.model

import com.gu.i18n.Currency

sealed trait ProductType {
  def currency: Currency
  def period: Period

  override def toString: String = this.getClass.getSimpleName
  def describe: String
}

case class Contribution(
  currency: Currency,
  period: Period,
  amount: BigDecimal
) extends ProductType {
  override def describe: String = s"$period-Contribution-$currency-$amount"
}

case class DigitalBundle(
  currency: Currency,
  period: Period
) extends ProductType {
  override def describe: String = s"$period-DigitalBundle-$currency"
}