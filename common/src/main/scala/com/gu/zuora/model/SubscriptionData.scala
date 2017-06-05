package com.gu.zuora.model

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.capitalizingCodec
import org.joda.time.LocalDate

object RatePlanCharge {
  implicit val codec: Codec[RatePlanCharge] = capitalizingCodec
}
case class RatePlanCharge(
  productRatePlanChargeId: String,
  price: Option[BigDecimal]
)

object RatePlan {
  implicit val codec: Codec[RatePlan] = capitalizingCodec
}
case class RatePlan(productRatePlanId: String)

object SubscriptionProductFeature {
  implicit val codec: Codec[SubscriptionProductFeature] = capitalizingCodec
}
case class SubscriptionProductFeature(featureId: String)

object Subscription {
  implicit val codec: Codec[Subscription] = capitalizingCodec
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
  implicit val codec: Codec[RatePlanChargeData] = capitalizingCodec
}
case class RatePlanChargeData(ratePlanCharge: RatePlanCharge)

object RatePlanData {
  implicit val codec: Codec[RatePlanData] = capitalizingCodec
}
case class RatePlanData(
  ratePlan: RatePlan,
  ratePlanChargeData: List[RatePlanChargeData],
  subscriptionProductFeatureList: List[SubscriptionProductFeature]
)

object SubscriptionData {
  implicit val codec: Codec[SubscriptionData] = capitalizingCodec
}
case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)