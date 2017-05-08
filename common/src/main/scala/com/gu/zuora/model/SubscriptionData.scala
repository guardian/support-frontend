package com.gu.zuora.model

import org.joda.time.LocalDate

case class SubscriptionData(RatePlanData: List[RatePlanData], Subscription: Subscription)

case class Subscription(ContractEffectiveDate: LocalDate,
  ContractAcceptanceDate: LocalDate,
  TermStartDate: LocalDate,
  AutoRenew: Boolean = true,
  //scalastyle:off magic.number
  InitialTerm: Int = 12,
  RenewalTerm: Int = 12,
  //scalastyle:on magic.number
  TermType: String = "TERMED")

case class RatePlanData(RatePlan: RatePlan,
  RatePlanChargeData: List[RatePlanChargeData],
  SubscriptionProductFeatureList: List[SubscriptionProductFeature])

case class RatePlan(ProductRatePlanId: String)

case class RatePlanChargeData(RatePlanCharge: RatePlanCharge)

case class RatePlanCharge(ProductRatePlanChargeId: String,
  Price: Option[BigDecimal])

case class SubscriptionProductFeature(FeatureId: String)
