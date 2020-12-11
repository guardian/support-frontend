package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api.SubscribeItem
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, buildProductSubscription, validateRatePlan}
import org.joda.time.{DateTimeZone, LocalDate}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionPaperState

class PaperSubscriptionBuilder(
  promotionService: PromotionService,
  environment: TouchPointEnvironment
) {
  def build(state: CreateZuoraSubscriptionPaperState): Either[PromoError, SubscribeItem] = {

    import state._

    val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

    val productRatePlanId = validateRatePlan(paperRatePlan(product, environment), product.describe)

    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = Direct
    )

    applyPromoCodeIfPresent(promotionService, promoCode, user.billingAddress.country, productRatePlanId, subscriptionData).map { subscriptionData =>
      val soldToContact = SubscribeItemBuilder.buildContactDetails(
        Some(user.primaryEmailAddress),
        user.firstName,
        user.lastName,
        user.deliveryAddress.get,
        user.deliveryInstructions
      )
      SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, state.salesForceContact, Some(state.paymentMethod), Some(soldToContact))
    }
  }
}
