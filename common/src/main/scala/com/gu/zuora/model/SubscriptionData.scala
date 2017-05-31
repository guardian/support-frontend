package com.gu.zuora.model

import io.circe.generic.semiauto._
import org.joda.time.LocalDate
import io.circe.{Decoder, Encoder}
import com.gu.zuora.encoding.CustomCodecs._

object RatePlanCharge {
  implicit val decoder: Decoder[RatePlanCharge] = deriveDecoder
  implicit val encoder: Encoder[RatePlanCharge] = deriveEncoder
}
case class RatePlanCharge(
  productRatePlanChargeId: String,
  price: Option[BigDecimal]
)

object RatePlan {
  implicit val decoder: Decoder[RatePlan] = deriveDecoder
  implicit val encoder: Encoder[RatePlan] = deriveEncoder
}
case class RatePlan(productRatePlanId: String)

object SubscriptionProductFeature {
  implicit val decoder: Decoder[SubscriptionProductFeature] = deriveDecoder
  implicit val encoder: Encoder[SubscriptionProductFeature] = deriveEncoder
}
case class SubscriptionProductFeature(featureId: String)

object Subscription {
  implicit val decoder: Decoder[Subscription] = deriveDecoder
  implicit val encoder: Encoder[Subscription] = deriveEncoder
}
case class Subscription(
  contractEffectiveDate: LocalDate,
  contractAcceptanceDate: LocalDate,
  termStartDate: LocalDate,
  autoRenew: Boolean = true,
  initialTerm: Int = 12,
  renewalTerm: Int = 12,
  termType: String = "TERMED"
)

object RatePlanChargeData {
  implicit val decoder: Decoder[RatePlanChargeData] = deriveDecoder
  implicit val encoder: Encoder[RatePlanChargeData] = deriveEncoder
}
case class RatePlanChargeData(ratePlanCharge: RatePlanCharge)

object RatePlanData {
  implicit val decoder: Decoder[RatePlanData] = deriveDecoder
  implicit val encoder: Encoder[RatePlanData] = deriveEncoder
}
case class RatePlanData(
  ratePlan: RatePlan,
  ratePlanChargeData: List[RatePlanChargeData],
  subscriptionProductFeatureList: List[SubscriptionProductFeature]
)

object SubscriptionData {
  implicit val decoder: Decoder[SubscriptionData] = deriveDecoder
  implicit val encoder: Encoder[SubscriptionData] = deriveEncoder
}
case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)