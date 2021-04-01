package com.gu.zuora.subscriptionBuilders

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.ExecutionContext

class DigitalSubscriptionGiftPurchaseBuilder(
  promotionService: PromotionService,
  today: () => LocalDate,
  giftCodeGeneratorService: GiftCodeGeneratorService,
  environment: TouchPointEnvironment,
) {

  def build(state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState)(implicit ec: ExecutionContext): Either[PromoError, SubscribeItem] = {

    import com.gu.WithLoggingSugar._

    val productRatePlanId = validateRatePlan(digitalRatePlan(state.product, environment), state.product.describe)

    val giftCode = giftCodeGeneratorService.generateCode(state.product.billingPeriod)
      .withLogging("Generated code for Digital Subscription gift")

    val todaysDate = today()
    val contractAcceptanceDate = todaysDate.plusDays(0)

    val subscriptionData = SubscriptionData(
      List(RatePlanData(RatePlan(productRatePlanId), Nil, Nil)),
      Subscription(
        contractEffectiveDate = todaysDate,
        contractAcceptanceDate = contractAcceptanceDate,
        termStartDate = todaysDate,
        createdRequestId = state.requestId.toString,
        readerType = state.product.readerType,
        autoRenew = false,
        initialTerm = GiftCodeValidator.expirationTimeInMonths + 1,
        initialTermPeriodType = Month,
        redemptionCode = Some(giftCode).map(Left.apply),
        giftNotificationEmailDate = Some(state.giftRecipient.deliveryDate),
      )
    )

    applyPromoCodeIfPresent(
      promotionService, state.promoCode, state.user.billingAddress.country, productRatePlanId, subscriptionData
    ).map { subscriptionData =>
      SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, state.salesforceContacts.recipient, Some(state.paymentMethod), None)
    }

  }

}
