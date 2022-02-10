package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.workers.GeneratedGiftCode
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionGiftPurchaseState
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

import scala.concurrent.ExecutionContext

class DigitalSubscriptionGiftPurchaseBuilder(
    promotionService: PromotionService,
    dateGenerator: DateGenerator,
    giftCodeGeneratorService: GiftCodeGeneratorService,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: DigitalSubscriptionGiftPurchaseState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  )(implicit ec: ExecutionContext): Either[PromoError, (SubscribeItem, GeneratedGiftCode)] = {

    import com.gu.WithLoggingSugar._

    val productRatePlanId = validateRatePlan(digitalRatePlan(state.product, environment), state.product.describe)

    val giftCode: GeneratedGiftCode = giftCodeGeneratorService
      .generateCode(state.product.billingPeriod)
      .withLogging("Generated code for Digital Subscription gift")

    val todaysDate = dateGenerator.today
    val contractAcceptanceDate = todaysDate.plusDays(0)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId,
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = contractAcceptanceDate,
      readerType = state.product.readerType,
      autoRenew = false,
      initialTerm = GiftCodeValidator.expirationTimeInMonths + 1,
      initialTermPeriodType = Month,
      redemptionCode = Some(giftCode.value),
      giftNotificationEmailDate = Some(state.giftRecipient.deliveryDate),
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.promoCode,
      state.billingCountry,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      val item = subscribeItemBuilder.build(
        subscriptionData,
        state.salesforceContacts.recipient,
        Some(state.paymentMethod),
        None,
      )
      (item, giftCode)
    }

  }

}
