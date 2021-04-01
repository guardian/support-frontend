package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.workers.BillingPeriod
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionContributionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

class ContributionSubscriptionBuilder(config: BillingPeriod => ZuoraContributionConfig) {

  def build(state: CreateZuoraSubscriptionContributionState): SubscribeItem = {
    val contributionConfig = config(state.product.billingPeriod)
    val subscriptionData = SubscriptionData(
      List(
        RatePlanData(
          RatePlan(contributionConfig.productRatePlanId),
          List(
            RatePlanChargeData(
              ContributionRatePlanCharge(
                contributionConfig.productRatePlanChargeId, price = state.product.amount
              ) //Pass the amount the user selected into Zuora
            )
          ),
          Nil
        )
      ),
      Subscription(
        contractEffectiveDate = LocalDate.now(DateTimeZone.UTC),
        contractAcceptanceDate = LocalDate.now(DateTimeZone.UTC),
        termStartDate = LocalDate.now(DateTimeZone.UTC),
        createdRequestId = state.requestId.toString,
        readerType = Direct,
        autoRenew = true,
        initialTerm = 12,
        initialTermPeriodType = Month,
      )
    )
    SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
  }

}
