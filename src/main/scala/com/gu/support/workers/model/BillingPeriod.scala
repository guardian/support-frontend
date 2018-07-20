package com.gu.support.workers.model


sealed trait BillingPeriod{
  val noun: String
}

object BillingPeriod {
  def fromString(code: String): Option[BillingPeriod] = List(Monthly, Annual).find(_.getClass.getSimpleName == s"$code$$")
}

case object Monthly extends BillingPeriod {
  override val noun = "month"
}

case object Quarterly extends BillingPeriod {
  override val noun = "quarter"
}

case object Annual extends BillingPeriod {
  override val noun = "year"
}
