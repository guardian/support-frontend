package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.LocalDate

class DigitalSubscriptionDirectPurchaseBuilder(
  config: ZuoraDigitalPackConfig,
  promotionService: PromotionService,
  today: () => LocalDate,
  environment: TouchPointEnvironment,
  subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState): Either[PromoError, SubscribeItem] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(state.product, environment), state.product.describe)

    val todaysDate = today()
    val contractAcceptanceDate = todaysDate.plusDays(config.defaultFreeTrialPeriod + config.paymentGracePeriod)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId,
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = contractAcceptanceDate,
      readerType = state.product.readerType,
      initialTermPeriodType = Month,
    )

    applyPromoCodeIfPresent(
      promotionService, state.promoCode, state.billingCountry, productRatePlanId, subscriptionData
    ).map { subscriptionData =>
      subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
    }

  }

}
