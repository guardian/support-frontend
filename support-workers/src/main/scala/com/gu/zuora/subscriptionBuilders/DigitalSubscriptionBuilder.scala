package com.gu.zuora.subscriptionBuilders

import cats.syntax.either._
import com.gu.helpers.DateGenerator
import com.gu.support.acquisitions.AbTest
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{DigitalPack, Monthly}
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

class DigitalSubscriptionBuilder(
    config: ZuoraDigitalPackConfig,
    promotionService: PromotionService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      product: DigitalPack,
      state: CreateZuoraSubscriptionState,
  ): Either[String, SubscribeItem] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(product, environment), product.describe)

    val todaysDate = dateGenerator.today
    val contractAcceptanceDate = todaysDate.plusDays(config.defaultFreeTrialPeriod + config.paymentGracePeriod)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = contractAcceptanceDate,
      readerType = ReaderType.impliedBySomeAppliedPromotion(state.appliedPromotion) getOrElse product.readerType,
      initialTermPeriodType = Month,
      csrUsername = state.csrUsername,
      salesforceCaseId = state.salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.appliedPromotion,
      productRatePlanId,
      subscriptionData,
    ).map(subscriptionData =>
      subscribeItemBuilder.build(subscriptionData, state.salesforceContacts.recipient, Some(state.paymentMethod), None),
    ).leftMap(_.toString)

  }

}
