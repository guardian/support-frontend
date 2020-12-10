package com.gu.zuora.subscriptionBuilders

import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.GeneratedGiftCode
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.ExecutionContext

class DigitalSubscriptionPurchaseBuilder(
  config: ZuoraDigitalPackConfig,
  promotionService: PromotionService,
  today: () => LocalDate,
  giftCodeGeneratorService: GiftCodeGeneratorService,
) {

  def build(
    state: CreateZuoraSubscriptionDSPurchaseState,
    environment: TouchPointEnvironment,
  )(implicit ec: ExecutionContext): Either[PromoError, SubscribeItem] = {

    import state._
    import com.gu.WithLoggingSugar._

    val productRatePlanId = validateRatePlan(digitalRatePlan(product, environment), product.describe)
    val subscriptionDataBuilder = new DigitalSubscriptionDataBuilder(promotionService, productRatePlanId, today, state)

    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        val giftCode = giftCodeGeneratorService.generateCode(state.product.billingPeriod)
          .withLogging("Generated code for Digital Subscription gift")
        subscriptionDataBuilder.buildSubscriptionData(
          contractAcceptanceDelay = 0,
          autoRenew = false,
          initialTerm = GiftCodeValidator.expirationTimeInMonths + 1,
          maybeRedemptionCode = Some(giftCode),
          deliveryDate = Some(state.giftRecipient.deliveryDate),
          promoCode = state.promoCode
        ).map { subscriptionData =>
          SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, state.salesforceContacts.recipient, Some(state.paymentMethod), None)
        }
      case state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState =>
        subscriptionDataBuilder.buildSubscriptionData(
          contractAcceptanceDelay = config.defaultFreeTrialPeriod + config.paymentGracePeriod,
          autoRenew = true,
          initialTerm = 12,
          maybeRedemptionCode = None,
          deliveryDate = None,
          promoCode = state.promoCode
        ).map { subscriptionData =>
          SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
        }
    }

  }
}
class DigitalSubscriptionDataBuilder(
  promotionService: PromotionService,
  productRatePlanId: ProductRatePlanId,
  today: () => LocalDate,
  state: CreateZuoraSubscriptionDSPurchaseState,
) {

  def buildSubscriptionData(
    contractAcceptanceDelay: Int,
    autoRenew: Boolean,
    initialTerm: Int,
    maybeRedemptionCode: Option[GeneratedGiftCode],
    deliveryDate: Option[LocalDate],
    promoCode: Option[PromoCode],
  ): Either[PromoError, SubscriptionData] = {

    val todaysDate = today()
    val contractAcceptanceDate = todaysDate.plusDays(contractAcceptanceDelay)

    val subscriptionData = SubscriptionData(
      List(RatePlanData(RatePlan(productRatePlanId), Nil, Nil)),
      Subscription(
        contractEffectiveDate = todaysDate,
        contractAcceptanceDate = contractAcceptanceDate,
        termStartDate = todaysDate,
        createdRequestId = state.requestId.toString,
        readerType = state.product.readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm,
        initialTermPeriodType = Month,
        redemptionCode = maybeRedemptionCode.map(Left.apply),
        giftNotificationEmailDate = deliveryDate,
      )
    )

    applyPromoCodeIfPresent(
      promotionService, promoCode, state.user.billingAddress.country, productRatePlanId, subscriptionData
    )
  }
}
