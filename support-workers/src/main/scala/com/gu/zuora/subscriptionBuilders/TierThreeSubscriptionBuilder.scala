package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.TierThreeState
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

class TierThreeSubscriptionBuilder(
    promotionService: PromotionService,
    environment: TouchPointEnvironment,
    dateGenerator: DateGenerator,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: TierThreeState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Either[PromoError, SubscribeItem] = {

    val contractEffectiveDate = dateGenerator.today

    val productRatePlanId =
      validateRatePlan(tierThreeRatePlan(state.product, environment), state.product.describe)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId,
      contractAcceptanceDate = state.firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = ReaderType.Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.promoCode,
      state.user.deliveryAddress.getOrElse(state.user.billingAddress).country,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      val soldToContact =
        SubscribeItemBuilder.buildContactDetails(
          Some(state.user.primaryEmailAddress),
          state.user.firstName,
          state.user.lastName,
          state.user.deliveryAddress.get,
          None,
        )

      subscribeItemBuilder.build(
        subscriptionData,
        state.salesForceContact,
        Some(state.paymentMethod),
        Some(soldToContact),
      )
    }
  }
}
