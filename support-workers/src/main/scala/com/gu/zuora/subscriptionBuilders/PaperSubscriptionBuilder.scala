package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionPaperState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.{DateTimeZone, LocalDate}

class PaperSubscriptionBuilder(
  promotionService: PromotionService,
  environment: TouchPointEnvironment
) {

  def build(state: CreateZuoraSubscriptionPaperState): Either[PromoError, SubscribeItem] = {

    import state._

    val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

    val productRatePlanId = validateRatePlan(paperRatePlan(product, environment), product.describe)

    val subscriptionData = SubscriptionData(
      List(
        RatePlanData(
          RatePlan(productRatePlanId),
          Nil,
          Nil
        )
      ),
      Subscription(
        contractEffectiveDate = contractEffectiveDate,
        contractAcceptanceDate = firstDeliveryDate,
        termStartDate = contractEffectiveDate,
        createdRequestId = requestId.toString,
        readerType = Direct,
        autoRenew = true,
        initialTerm = 12,
        initialTermPeriodType = Month,
      )
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
