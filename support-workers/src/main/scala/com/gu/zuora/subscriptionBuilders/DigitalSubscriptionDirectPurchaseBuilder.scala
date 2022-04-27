package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.abtests.BenefitsTest.isValidBenefitsTestPurchase
import com.gu.support.acquisitions.{AbTest, AcquisitionData}
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.{DigitalPack, Monthly}
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

class DigitalSubscriptionDirectPurchaseBuilder(
    config: ZuoraDigitalPackConfig,
    promotionService: PromotionService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: DigitalSubscriptionDirectPurchaseState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
      acquisitionData: Option[AcquisitionData],
  ): Either[PromoError, SubscribeItem] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(state.product, environment), state.product.describe)

    val todaysDate = dateGenerator.today
    val contractAcceptanceDate = todaysDate.plusDays(config.defaultFreeTrialPeriod + config.paymentGracePeriod)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId,
      overridePricingIfRequired(state.product, acquisitionData.map(_.supportAbTests)),
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = contractAcceptanceDate,
      readerType = state.product.readerType,
      initialTermPeriodType = Month,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.promoCode,
      state.billingCountry,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
    }

  }

  def overridePricingIfRequired(product: DigitalPack, maybeAbTests: Option[Set[AbTest]]) =
    if (isValidBenefitsTestPurchase(product, maybeAbTests)) {
      product.amount
        .map { amount =>
          val ratePlanChargeId =
            if (product.billingPeriod == Monthly) config.monthlyChargeId else config.annualChargeId
          List(
            RatePlanChargeData(
              RatePlanChargeOverride(
                ratePlanChargeId,
                price = amount, // Pass the amount the user selected into Zuora
              ),
            ),
          )
        }
        .getOrElse(Nil)
    } else Nil

}
