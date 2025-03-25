package com.gu.zuora.subscriptionBuilders

import cats.syntax.either._
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.Paper
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.{DateTimeZone, LocalDate}

class PaperSubscriptionBuilder(
    promotionService: PromotionService,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      product: Paper,
      state: CreateZuoraSubscriptionState,
  ): Either[String, SubscribeItem] = {

    val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

    val productRatePlanId = validateRatePlan(paperRatePlan(product, environment), product.describe)

    for {
      firstDeliveryDate <- state.firstDeliveryDate.toRight(
        "First delivery date is required for a Paper subscription",
      )
      subscriptionData = subscribeItemBuilder.buildProductSubscription(
        productRatePlanId,
        contractAcceptanceDate = firstDeliveryDate,
        contractEffectiveDate = contractEffectiveDate,
        readerType = Direct,
        csrUsername = state.csrUsername,
        salesforceCaseId = state.salesforceCaseId,
        deliveryAgent = product.deliveryAgent,
      )
      subscribeItem <- applyPromoCodeIfPresent(
        promotionService,
        state.appliedPromotion,
        productRatePlanId,
        subscriptionData,
      ).map { subscriptionData =>
        val soldToContact = SubscribeItemBuilder.buildContactDetails(
          Some(state.user.primaryEmailAddress),
          state.user.firstName,
          state.user.lastName,
          state.user.deliveryAddress.get,
          state.user.deliveryInstructions,
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
