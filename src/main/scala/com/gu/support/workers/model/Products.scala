package com.gu.support.workers.model

import com.gu.i18n.Currency

sealed trait ProductType {
  def currency: Currency
  def period: Period

  override def toString  = this.getClass.getSimpleName
}

case class Contribution(
  currency: Currency,
  period: Period,
  amount: BigDecimal
) extends ProductType {
  def describe = s"$period-Contribution-$currency"
}

case class DigitalBundle(
  currency: Currency,
  period: Period
) extends ProductType {
  def describe = s"$period-DigitalBundle-$currency"
}