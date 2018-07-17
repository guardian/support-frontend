package com.gu.support.workers.model


sealed trait BillingPeriod

object BillingPeriod {
  def fromString(code: String): Option[BillingPeriod] = List(Monthly, Annual).find(_.getClass.getSimpleName == s"$code$$")
}

case object Monthly extends BillingPeriod

case object Quarterly extends BillingPeriod

case object Annual extends BillingPeriod
