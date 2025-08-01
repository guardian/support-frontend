package com.gu.zuora.subscriptionBuilders

import com.gu.support.catalog.NationalDelivery
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.paperround.AgentId
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.Paper
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.PaperState
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
      state: PaperState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Either[PromoError, SubscribeItem] = {

    import state._

    val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

    val productRatePlanId = validateRatePlan(paperRatePlan(product, environment), product.describe)

    val deliveryAgent = validateDeliveryAgent(product);

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId,
      contractAcceptanceDate = state.firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
      deliveryAgent = deliveryAgent,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.appliedPromotion,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      val soldToContact = SubscribeItemBuilder.buildContactDetails(
        Some(user.primaryEmailAddress),
        user.firstName,
        user.lastName,
        user.deliveryAddress.get,
        user.deliveryInstructions,
      )
      subscribeItemBuilder.build(
        subscriptionData,
        state.salesForceContact,
        Some(state.paymentMethod),
        Some(soldToContact),
      )
    }
  }

  def validateDeliveryAgent(paper: Paper): Option[AgentId] = {
    if (paper.fulfilmentOptions == NationalDelivery && paper.deliveryAgent.isEmpty) {
      throw new IllegalArgumentException(
        s"National Delivery subscriptions must have a delivery agent. ${paper.describe} does not have an agentId.",
      )
    }
    paper.deliveryAgent
  }

}
