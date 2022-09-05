package com.gu.model.zuora.response

import com.gu.supporterdata.model.ContributionAmount
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class MinimalZuoraSubscription(ratePlans: List[RatePlan]) {
  def contributionAmount = for {
    ratePlans <- ratePlans.headOption
    charges <- ratePlans.ratePlanCharges.headOption
  } yield ContributionAmount(charges.price, charges.currency)
}

case class RatePlan(ratePlanCharges: List[RatePlanCharge])

case class RatePlanCharge(price: BigDecimal, currency: String)

object MinimalZuoraSubscription {
  implicit val decoder: Decoder[MinimalZuoraSubscription] = deriveDecoder
}

object RatePlan {
  implicit val decoder: Decoder[RatePlan] = deriveDecoder
}

object RatePlanCharge {
  implicit val decoder: Decoder[RatePlanCharge] = deriveDecoder
}
