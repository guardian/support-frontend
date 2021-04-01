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
) {

  def build(state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState): Either[PromoError, SubscribeItem] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(state.product, environment), state.product.describe)

    val todaysDate = today()
    val contractAcceptanceDate = todaysDate.plusDays(config.defaultFreeTrialPeriod + config.paymentGracePeriod)

    val subscriptionData = SubscriptionData(
      List(RatePlanData(RatePlan(productRatePlanId), Nil, Nil)),
      Subscription(
        contractEffectiveDate = todaysDate,
        contractAcceptanceDate = contractAcceptanceDate,
        termStartDate = todaysDate,
        createdRequestId = state.requestId.toString,
        readerType = state.product.readerType,
        autoRenew = true,
        initialTerm = 12,
        initialTermPeriodType = Month,
        redemptionCode = None.map(Left.apply),
        giftNotificationEmailDate = None,
      )
    )

    applyPromoCodeIfPresent(
      promotionService, state.promoCode, state.user.billingAddress.country, productRatePlanId, subscriptionData
    ).map { subscriptionData =>
      SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
    }

  }

}
