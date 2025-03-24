package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers.GuardianAdLite
import com.gu.support.workers.ProductTypeRatePlans.guardianAdLiteRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api.SubscribeItem
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.validateRatePlan

class GuardianAdLiteSubscriptionBuilder(
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {
  def build(
      product: GuardianAdLite,
      state: CreateZuoraSubscriptionState,
  ): SubscribeItem = {
    val productRatePlanId = {
      validateRatePlan(guardianAdLiteRatePlan(product, environment), product.describe)
    }

    val todaysDate = dateGenerator.today
    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = todaysDate.plusDays(GuardianAdLiteSubscriptionBuilder.gracePeriodInDays),
      readerType = Direct,
      csrUsername = state.csrUsername,
      salesforceCaseId = state.salesforceCaseId,
    )

    subscribeItemBuilder.build(subscriptionData, state.salesForceContacts.recipient, Some(state.paymentMethod), None)
  }
}

object GuardianAdLiteSubscriptionBuilder {
  // The user isn't charged until day 15
  val gracePeriodInDays = 15
}
