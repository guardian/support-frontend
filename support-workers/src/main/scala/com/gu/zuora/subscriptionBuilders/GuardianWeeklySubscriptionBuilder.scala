package com.gu.zuora.subscriptionBuilders

import cats.syntax.either._
import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.GuardianWeekly
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionState
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
      product: GuardianWeekly,
      state: CreateZuoraSubscriptionState,
  ): Either[String, SubscribeItem] = {

    val contractEffectiveDate = dateGenerator.today
    val readerType = if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct
    val recurringProductRatePlanId =
      validateRatePlan(weeklyRatePlan(product, environment, readerType), product.describe)
    for {
      firstDeliveryDate <- state.firstDeliveryDate.toRight(
        "First delivery date is required for a Guardian Weekly subscription",
      )
      (initialTerm, autoRenew, initialTermPeriodType) =
        if (readerType == Gift)
          (
            initialTermInDays(contractEffectiveDate, firstDeliveryDate, state.product.billingPeriod.monthsInPeriod),
            false,
            Day,
          )
        else
          (12, true, Month)
      subscriptionData = subscribeItemBuilder.buildProductSubscription(
        recurringProductRatePlanId,
        contractAcceptanceDate = firstDeliveryDate,
        contractEffectiveDate = contractEffectiveDate,
        readerType = ReaderType.impliedBySomeAppliedPromotion(state.appliedPromotion) getOrElse readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm,
        initialTermPeriodType = initialTermPeriodType,
        csrUsername = state.csrUsername,
        salesforceCaseId = state.salesforceCaseId,
      )
      subscribeItem <- applyPromo(subscriptionData, recurringProductRatePlanId, state)
    } yield subscribeItem

  }
  def applyPromo(
      subscriptionData: SubscriptionData,
      recurringProductRatePlanId: String,
      state: CreateZuoraSubscriptionState,
  ): Either[String, SubscribeItem] = applyPromoCodeIfPresent(
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
      state.salesForceContacts.recipient,
      Some(state.paymentMethod),
      Some(soldToContact),
    )
  }.leftMap(_.toString)
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
