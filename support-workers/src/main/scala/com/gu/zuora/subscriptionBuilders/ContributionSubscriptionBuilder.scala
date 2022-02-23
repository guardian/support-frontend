package com.gu.zuora.subscriptionBuilders

import com.gu.support.acquisitions.AcquisitionData
import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.workers.BillingPeriod
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.ContributionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._

class ContributionSubscriptionBuilder(
    config: BillingPeriod => ZuoraContributionConfig,
    maybeAcquisitionData: Option[AcquisitionData],
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(state: ContributionState): SubscribeItem = {
    val contributionConfig = config(state.product.billingPeriod)
    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      contributionConfig.productRatePlanId,
      List(
        RatePlanChargeData(
          ContributionRatePlanCharge(
            contributionConfig.productRatePlanChargeId,
            price = state.product.amount,
          ), // Pass the amount the user selected into Zuora
        ),
      ),
      readerType = Direct,
      acquisitionMetadata = maybeGetAcquisitionMetadata(state),
    )

    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
  }

  def maybeGetAcquisitionMetadata(state: ContributionState) =
    for {
      acquisitionData <- maybeAcquisitionData
      abTest <- acquisitionData.supportAbTests.find(test => test.name == "digisubBenefits" && test.variant == "variant")
      hasContributedEnough <-
        if (state.product.amount > 15) Some(true) else None // TODO get the correct amount for country
    } yield AcquisitionMetadata(true)

}
