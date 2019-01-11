package com.gu.support.workers

import io.circe.{Decoder, Encoder}


sealed trait BillingPeriod{
  val noun: String
}

object BillingPeriod {
  def fromString(code: String) = List(Monthly, Annual, Quarterly, SixWeekly)
    .find(_.getClass.getSimpleName == s"$code$$")

  implicit val decodePeriod: Decoder[BillingPeriod] =
    Decoder.decodeString.emap(code => BillingPeriod.fromString(code).toRight(s"unrecognised billing period '$code'"))
  implicit val encodePeriod: Encoder[BillingPeriod] = Encoder.encodeString.contramap[BillingPeriod](_.toString)

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

case object SixWeekly extends BillingPeriod {
  override val noun = "six weeks"
}
