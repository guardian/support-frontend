package com.gu.zuora.subscriptionBuilders

import cats.syntax.either._
import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.TierThree
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

class TierThreeSubscriptionBuilder(
    promotionService: PromotionService,
    environment: TouchPointEnvironment,
    dateGenerator: DateGenerator,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      product: TierThree,
      state: CreateZuoraSubscriptionState,
  ): Either[String, SubscribeItem] = {

    val contractEffectiveDate = dateGenerator.today

    val productRatePlanId =
      validateRatePlan(tierThreeRatePlan(product, environment), product.describe)

    for {
      firstDeliveryDate <- state.firstDeliveryDate.toRight(
        "First delivery date is required for a Tier Three subscription",
      )
      subscriptionData = subscribeItemBuilder.buildProductSubscription(
        productRatePlanId,
        contractAcceptanceDate = firstDeliveryDate,
        contractEffectiveDate = contractEffectiveDate,
        readerType = ReaderType.Direct,
        csrUsername = state.csrUsername,
        salesforceCaseId = state.salesforceCaseId,
      )
      subscribeItem <- applyPromoCodeIfPresent(
        promotionService,
        state.appliedPromotion,
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
          state.salesForceContacts.recipient,
          Some(state.paymentMethod),
          Some(soldToContact),
        )
      }.leftMap(_.toString)
    } yield subscribeItem
  }
}
