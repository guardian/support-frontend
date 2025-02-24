package com.gu.supporterdata.model

import java.time.LocalDate

case class SupporterRatePlanItem(
    subscriptionName: String, // Unique identifier for the subscription
    identityId: String, // Unique identifier for user
    productRatePlanId: String, // Unique identifier for the product in this rate plan
    productRatePlanName: String, // Name of the product in this rate plan
    termEndDate: LocalDate, // Date that this subscription term ends
    contractEffectiveDate: LocalDate, // Date that this subscription started
    contributionAmount: Option[ContributionAmount],
)

case class ContributionAmount(amount: BigDecimal, currency: String)
