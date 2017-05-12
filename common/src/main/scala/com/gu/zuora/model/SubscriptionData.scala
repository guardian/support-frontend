package com.gu.zuora.model

import org.joda.time.LocalDate

case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)

case class Subscription(
  contractEffectiveDate: LocalDate,
  contractAcceptanceDate: LocalDate,
  termStartDate: LocalDate,
  autoRenew: Boolean = true,
  initialTerm: Int = 12,
  renewalTerm: Int = 12,
  termType: String = "TERMED"
)

case class RatePlanData(
  ratePlan: RatePlan,
  ratePlanChargeData: List[RatePlanChargeData],
  subscriptionProductFeatureList: List[SubscriptionProductFeature]
)

case class RatePlan(productRatePlanId: String)

case class RatePlanChargeData(ratePlanCharge: RatePlanCharge)

case class RatePlanCharge(
  productRatePlanChargeId: String,
  price: Option[BigDecimal]
)

case class SubscriptionProductFeature(featureId: String)
