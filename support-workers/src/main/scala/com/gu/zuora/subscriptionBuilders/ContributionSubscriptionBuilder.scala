package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{BillingPeriod, Contribution}
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._

class ContributionSubscriptionBuilder(
    config: BillingPeriod => ZuoraContributionConfig,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(product: Contribution, state: CreateZuoraSubscriptionState): SubscribeItem = {
    val contributionConfig = config(product.billingPeriod)
    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      contributionConfig.productRatePlanId,
      List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            contributionConfig.productRatePlanChargeId,
            price = product.amount,
          ), // Pass the amount the user selected into Zuora
        ),
      ),
      readerType = Direct,
    )
    subscribeItemBuilder.build(subscriptionData, state.salesforceContacts.recipient, Some(state.paymentMethod), None)
  }

}
