package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers.ProductTypeRatePlans.guardianLightRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianAdLiteState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api.SubscribeItem
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.validateRatePlan

class GuardianLightSubscriptionBuilder(
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {
  def build(
      state: GuardianAdLiteState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): SubscribeItem = {
    val productRatePlanId = {
      validateRatePlan(guardianLightRatePlan(state.product, environment), state.product.describe)
    }

    val todaysDate = dateGenerator.today
    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = todaysDate.plusDays(GuardianLightSubscriptionBuilder.gracePeriodInDays),
      readerType = Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
  }
}

object GuardianLightSubscriptionBuilder {
  // The user isn't charged until day 15
  val gracePeriodInDays = 15
}
