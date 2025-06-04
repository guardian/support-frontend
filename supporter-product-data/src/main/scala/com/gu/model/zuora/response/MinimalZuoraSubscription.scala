package com.gu.model.zuora.response

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class MinimalZuoraSubscription(ratePlans: List[RatePlan])

case class RatePlan(id: String, ratePlanCharges: List[RatePlanCharge])

case class RatePlanCharge(price: Option[BigDecimal], currency: String)

case class MinimalZuoraError(message: String) extends Throwable

object MinimalZuoraSubscription {
  implicit val decoder: Decoder[MinimalZuoraSubscription] = deriveDecoder
}

object RatePlan {
  implicit val decoder: Decoder[RatePlan] = deriveDecoder
}

object RatePlanCharge {
  implicit val decoder: Decoder[RatePlanCharge] = deriveDecoder
}

object MinimalZuoraError {
  implicit val decoder: Decoder[MinimalZuoraError] = deriveDecoder
}
