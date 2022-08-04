package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.workers.BillingPeriod
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.ContributionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

class ContributionSubscriptionBuilder(
    config: BillingPeriod => ZuoraContributionConfig,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(state: ContributionState): SubscribeItem = {
    val contributionConfig = config(state.product.billingPeriod)
    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      contributionConfig.productRatePlanId,
      List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            contributionConfig.productRatePlanChargeId,
            price = state.product.amount,
          ), // Pass the amount the user selected into Zuora
        ),
      ),
      readerType = Direct,
    )
    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
  }

}
