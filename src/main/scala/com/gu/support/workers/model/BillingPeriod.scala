package com.gu.support.workers.model


sealed trait BillingPeriod {
  def fromString(code: String): Option[BillingPeriod] = List(Monthly, Annual).find(_.getClass.getSimpleName == s"$code$$")
}

object BillingPeriod extends BillingPeriod

case object Monthly extends BillingPeriod

case object Annual extends BillingPeriod
