package com.gu.zuora.model

import com.gu.zuora.encoding.CapitalizationEncoder._
import io.circe.generic.semiauto._
import org.joda.time.LocalDate
import io.circe.{Decoder, Encoder}
import com.gu.zuora.encoding.CustomCodecs._

object RatePlanCharge {
  implicit val decoder: Decoder[RatePlanCharge] = decapitalizingDecoder
  implicit val encoder: Encoder[RatePlanCharge] = capitalizingEncoder
}
case class RatePlanCharge(
  productRatePlanChargeId: String,
  price: Option[BigDecimal]
)

object RatePlan {
  implicit val decoder: Decoder[RatePlan] = decapitalizingDecoder
  implicit val encoder: Encoder[RatePlan] = capitalizingEncoder
}
case class RatePlan(productRatePlanId: String)

object SubscriptionProductFeature {
  implicit val encoder: Encoder[SubscriptionProductFeature] = capitalizingEncoder
  implicit val decoder: Decoder[SubscriptionProductFeature] = decapitalizingDecoder
}
case class SubscriptionProductFeature(featureId: String)

object Subscription {
  implicit val decoder: Decoder[Subscription] = decapitalizingDecoder
  implicit val encoder: Encoder[Subscription] = capitalizingEncoder
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
  implicit val decoder: Decoder[RatePlanChargeData] = decapitalizingDecoder
  implicit val encoder: Encoder[RatePlanChargeData] = capitalizingEncoder
}
case class RatePlanChargeData(ratePlanCharge: RatePlanCharge)

object RatePlanData {
  implicit val decoder: Decoder[RatePlanData] = decapitalizingDecoder
  implicit val encoder: Encoder[RatePlanData] = capitalizingEncoder
}
case class RatePlanData(
  ratePlan: RatePlan,
  ratePlanChargeData: List[RatePlanChargeData],
  subscriptionProductFeatureList: List[SubscriptionProductFeature]
)

object SubscriptionData {
  implicit val decoder: Decoder[SubscriptionData] = decapitalizingDecoder
  implicit val encoder: Encoder[SubscriptionData] = capitalizingEncoder
}
case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)