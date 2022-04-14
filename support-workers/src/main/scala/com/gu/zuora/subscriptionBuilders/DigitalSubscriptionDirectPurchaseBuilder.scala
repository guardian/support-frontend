package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.Monthly
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionDirectPurchaseState
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
  ): Either[PromoError, SubscribeItem] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(state.product, environment), state.product.describe)

    val todaysDate = dateGenerator.today
    val contractAcceptanceDate = todaysDate.plusDays(config.defaultFreeTrialPeriod + config.paymentGracePeriod)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId,
      overridePricingIfRequired(state),
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

  def overridePricingIfRequired(state: DigitalSubscriptionDirectPurchaseState) = {
    state.product.amount
      .map { amount =>
        // TODO: Limit this specifically to people in the benefits test
        val ratePlanChargeId =
          if (state.product.billingPeriod == Monthly) config.monthlyChargeId else config.annualChargeId
        List(
          RatePlanChargeData(
            ContributionRatePlanCharge(
              ratePlanChargeId,
              price = amount,
            ), // Pass the amount the user selected into Zuora
          ),
        )
      }
      .getOrElse(Nil)
  }

}
