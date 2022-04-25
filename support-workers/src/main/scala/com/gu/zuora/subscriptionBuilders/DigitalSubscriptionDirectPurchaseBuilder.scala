package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.i18n.Currency
import com.gu.i18n.Currency._
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.{Annual, BillingPeriod, Monthly}
import com.gu.support.zuora.api.{Month, RatePlanChargeData, RatePlanChargeOverride, SubscribeItem}
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
      .filter(amount => priceIsHighEnough(amount, state.product.billingPeriod, state.product.currency))
      .map { amount =>
        val ratePlanChargeId =
          if (state.product.billingPeriod == Monthly) config.monthlyChargeId else config.annualChargeId
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
  }

  def priceIsHighEnough(amount: BigDecimal, billingPeriod: BillingPeriod, currency: Currency) = {
    val requiredAmount = (billingPeriod, currency) match {
      case (Monthly, GBP) => 12
      case (Annual, GBP) => 119
      case (Monthly, USD) => 20
      case (Annual, USD) => 199
      case (Monthly, EUR) => 15
      case (Annual, GBP) => 149
      case (Monthly, NZD) => 24
      case (Annual, NZD) => 235
      case (Monthly, CAD) => 22
      case (Annual, CAD) => 219
    }
    amount >= requiredAmount
  }

}
