package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.workers.BillingPeriod
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.ContributionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import com.gu.helpers.DateGenerator

class ContributionSubscriptionBuilder(
    config: BillingPeriod => ZuoraContributionConfig,
    subscribeItemBuilder: SubscribeItemBuilder,
    dateGenerator: DateGenerator,
) {

  def build(state: ContributionState): SubscribeItem = {
    val contributionConfig = config(state.product.billingPeriod)

    val contractEffectiveDate = dateGenerator.today

    // Before 26 July 2022 the Customer Acceptance Date for Recurring Contributions was always  the same as the
    // Contract Effective Date (i.e. today). A change was made to push the CAS one day forward so as not to trigger
    // an invoice and payment immediately when making a Recurring Contribution. This will affect the customer experience
    // for users who have no money in their account when purchasing, as tbey will no longer be notified on the checkout,
    // instead they will be notified by email the day after purchasing.
    //
    // The reason for making this change relates to a project being undertaken by the Finance team on August 1st 2022
    // to re-publish revenue schedules from 4-4-5 over to calendar monthly. This change is going live a few days ahead
    // of that date to enable the change to be monitored for any issues downstream.
    val contractAcceptanceDate = contractEffectiveDate.plusDays(1)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = contributionConfig.productRatePlanId,
      ratePlanCharges = List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            contributionConfig.productRatePlanChargeId,
            price = state.product.amount,
          ), // Pass the amount the user selected into Zuora
        ),
      ),
      contractEffectiveDate = contractEffectiveDate,
      contractAcceptanceDate = contractAcceptanceDate,
      readerType = Direct,
    )
    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
  }

}
