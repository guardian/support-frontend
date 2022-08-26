package com.gu.model.zuora.response

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class MinimalZuoraSubscription(ratePlans: List[RatePlan]) {
  def price = for {
    ratePlans <- ratePlans.headOption
    charges <- ratePlans.ratePlanCharges.headOption
  } yield charges.price
}

case class RatePlan(ratePlanCharges: List[RatePlanCharge])

case class RatePlanCharge(price: BigDecimal)

object MinimalZuoraSubscription {
  implicit val decoder: Decoder[MinimalZuoraSubscription] = deriveDecoder
}

object RatePlan {
  implicit val decoder: Decoder[RatePlan] = deriveDecoder
}

object RatePlanCharge {
  implicit val decoder: Decoder[RatePlanCharge] = deriveDecoder
}
