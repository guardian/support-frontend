package com.gu.support.workers

import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait BillingPeriod {
  val noun: String
  val monthsInPeriod: Int
}

object BillingPeriod {
  def fromString(code: String): Option[BillingPeriod] = {
    List(Monthly, Annual, Quarterly, SixWeekly).find(_.getClass.getSimpleName == s"$code$$")
  }

  implicit val decodePeriod: Decoder[BillingPeriod] =
    Decoder.decodeString.emap(code => BillingPeriod.fromString(code).toRight(s"unrecognised billing period '$code'"))

  implicit val encodePeriod: Encoder[BillingPeriod] = Encoder.encodeString.contramap[BillingPeriod](_.toString)

  implicit val keyEncoder: KeyEncoder[BillingPeriod] = (billingPeriod: BillingPeriod) => billingPeriod.toString

  implicit val keyDecoder: KeyDecoder[BillingPeriod] = (key: String) => fromString(key)
}

case object Monthly extends BillingPeriod {
  override val noun: String = "month"
  override val monthsInPeriod: Int = 1
}

case object Quarterly extends BillingPeriod {
  override val noun: String = "quarter"
  override val monthsInPeriod: Int = 3
}

case object Annual extends BillingPeriod {
  override val noun: String = "year"
  override val monthsInPeriod: Int = 12
}

case object SixWeekly extends BillingPeriod {
  override val noun: String = "six weeks"
  override val monthsInPeriod: Int = 1
}
