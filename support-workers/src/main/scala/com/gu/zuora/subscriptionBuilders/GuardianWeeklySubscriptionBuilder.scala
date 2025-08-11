package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianWeeklyState
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.GuardianWeeklySubscriptionBuilder.initialTermInDays
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.{Days, LocalDate}

class GuardianWeeklySubscriptionBuilder(
    promotionService: PromotionService,
    environment: TouchPointEnvironment,
    dateGenerator: DateGenerator,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: GuardianWeeklyState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Either[PromoError, SubscribeItem] = {
    val contractEffectiveDate = dateGenerator.today
    val readerType = if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct
    val recurringProductRatePlanId =
      validateRatePlan(weeklyRatePlan(state.product, environment, readerType), state.product.describe)

    val (initialTerm, autoRenew, initialTermPeriodType) =
      if (readerType == Gift)
        (
          initialTermInDays(contractEffectiveDate, state.firstDeliveryDate, state.product.billingPeriod.monthsInPeriod),
          false,
          Day,
        )
      else
        (12, true, Month)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      recurringProductRatePlanId,
      contractAcceptanceDate = state.firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = ReaderType.impliedBySomeAppliedPromotion(state.appliedPromotion) getOrElse readerType,
      autoRenew = autoRenew,
      initialTerm = initialTerm,
      initialTermPeriodType = initialTermPeriodType,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.appliedPromotion,
      recurringProductRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      val soldToContact = state.giftRecipient match {
        case None =>
          SubscribeItemBuilder.buildContactDetails(
            Some(state.user.primaryEmailAddress),
            state.user.firstName,
            state.user.lastName,
            state.user.deliveryAddress.get,
            None,
          )
        case Some(gR) =>
          SubscribeItemBuilder.buildContactDetails(
            gR.email,
            gR.firstName,
            gR.lastName,
            state.user.deliveryAddress.get,
            None,
          )
      }
      subscribeItemBuilder.build(
        subscriptionData,
        state.salesForceContact,
        Some(state.paymentMethod),
        Some(soldToContact),
      )
    }
  }
}
object GuardianWeeklySubscriptionBuilder {
  def initialTermInDays(
      contractEffectiveDate: LocalDate,
      contractAcceptanceDate: LocalDate,
      termLengthMonths: Int,
  ): Int = {
    val termEnd = contractAcceptanceDate.plusMonths(termLengthMonths)
    Days.daysBetween(contractEffectiveDate, termEnd).getDays
  }
}
