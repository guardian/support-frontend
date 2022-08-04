package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.abtests.BenefitsTest.isValidBenefitsTestPurchase
import com.gu.support.acquisitions.{AbTest, AcquisitionData}
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig, ZuoraSupporterPlusConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans.{digitalRatePlan, supporterPlusRatePlan}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{
  DigitalSubscriptionDirectPurchaseState,
  SupporterPlusState,
}
import com.gu.support.workers.{DigitalPack, Monthly, SupporterPlus}
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

class SupporterPlusSubcriptionBuilder(
    config: ZuoraSupporterPlusConfig,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): SubscribeItem = {

    val productRatePlanId = validateRatePlan(supporterPlusRatePlan(state.product, environment), state.product.describe)
    val ratePlanChargeId = if (state.product.billingPeriod == Monthly) config.monthlyChargeId else config.annualChargeId
    val todaysDate = dateGenerator.today

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      ratePlanCharges = List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            ratePlanChargeId,
            price = state.product.amount, // Pass the amount the user selected into Zuora
          ),
        ),
      ),
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = todaysDate,
      readerType = Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )
    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)

  }
}
