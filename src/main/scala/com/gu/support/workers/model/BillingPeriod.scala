package com.gu.support.workers.model

import io.circe.{Decoder, Encoder}


sealed trait BillingPeriod{
  val noun: String
}

object BillingPeriod {
  def fromString(code: String): Option[BillingPeriod] = List(Monthly, Annual).find(_.getClass.getSimpleName == s"$code$$")
  implicit val decodePeriod: Decoder[BillingPeriod] =
    Decoder.decodeString.emap(code => BillingPeriod.fromString(code).toRight(s"Unrecognised period code '$code'"))
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
