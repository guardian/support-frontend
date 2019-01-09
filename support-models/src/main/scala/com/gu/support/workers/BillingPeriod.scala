package com.gu.support.workers

import io.circe.{Decoder, Encoder}


sealed trait BillingPeriod{
  val noun: String
  val synonym: Option[String] = None
}

object BillingPeriod {
  def fromString(code: String): BillingPeriod = List(Monthly, Annual, Quarterly, SixWeekly)
    .find{billingPeriod =>
      billingPeriod.getClass.getSimpleName == s"$code$$" || billingPeriod.synonym.contains(s"$code")}
    .getOrElse(NoBillingPeriod)

  implicit val decodePeriod: Decoder[BillingPeriod] = Decoder.decodeString.map(code => BillingPeriod.fromString(code))
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
  override val synonym = Some("Yearly")
}

case object SixWeekly extends BillingPeriod {
  override val noun = "six weeks"
  override val synonym = Some("SixWeeks")
}

case object NoBillingPeriod extends BillingPeriod {
  override val noun = "None"
}
