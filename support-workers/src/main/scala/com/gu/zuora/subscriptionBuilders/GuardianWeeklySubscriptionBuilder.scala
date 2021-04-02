package com.gu.zuora.subscriptionBuilders

import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{DefaultPromotions, PromoCode, PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionGuardianWeeklyState
import com.gu.support.workers.{BillingPeriod, SixWeekly}
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.GuardianWeeklySubscriptionBuilder.initialTermInDays
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.{Days, LocalDate}

class GuardianWeeklySubscriptionBuilder(
  promotionService: PromotionService,
  environment: TouchPointEnvironment,
  now: () => LocalDate,
  subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(state: CreateZuoraSubscriptionGuardianWeeklyState): Either[PromoError, SubscribeItem] = {

    val readerType = if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct

    val recurringProductRatePlanId = validateRatePlan(weeklyRatePlan(state.product, environment, readerType), state.product.describe)

    val promotionProductRatePlanId = if (isIntroductoryPromotion(state.product.billingPeriod, state.promoCode)) {
      weeklyIntroductoryRatePlan(state.product, environment).map(_.id).getOrElse(recurringProductRatePlanId)
    } else recurringProductRatePlanId

    val subscriptionData = buildSubscriptionData(state, recurringProductRatePlanId)

    applyPromoCodeIfPresent(
      promotionService,
      state.promoCode,
      state.user.billingAddress.country,
      promotionProductRatePlanId,
      subscriptionData
    ).map { subscriptionData =>
      val soldToContact = state.giftRecipient match {
        case None =>
          ContactDetails.fromAddress(Some(state.user.primaryEmailAddress), state.user.firstName, state.user.lastName, state.user.deliveryAddress.get, None)
        case Some(gR) =>
          ContactDetails.fromAddress(gR.email, gR.firstName, gR.lastName, state.user.deliveryAddress.get, None)
      }
      subscribeItemBuilder.build(subscriptionData, state.salesforceContacts.recipient, Some(state.paymentMethod), Some(soldToContact))
    }
  }

  private[this] def isIntroductoryPromotion(billingPeriod: BillingPeriod, maybePromoCode: Option[PromoCode]) =
    maybePromoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix) && billingPeriod == SixWeekly

  private def buildSubscriptionData(state: CreateZuoraSubscriptionGuardianWeeklyState, recurringProductRatePlanId: ProductRatePlanId) = {
    val contractEffectiveDate = now()

    val readerType = if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct

    val (initialTerm, autoRenew, initialTermPeriodType) = if (readerType == ReaderType.Gift)
      (initialTermInDays(contractEffectiveDate, state.firstDeliveryDate, state.product.billingPeriod.monthsInPeriod), false, Day)
    else
      (12, true, Month)

    subscribeItemBuilder.buildProductSubscription(
      recurringProductRatePlanId,
      contractAcceptanceDate = state.firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = readerType,
      autoRenew = autoRenew,
      initialTerm = initialTerm,
      initialTermPeriodType = initialTermPeriodType
    )
  }

}
object GuardianWeeklySubscriptionBuilder {
  def initialTermInDays(contractEffectiveDate: LocalDate, contractAcceptanceDate: LocalDate, termLengthMonths: Int): Int = {
    val termEnd = contractAcceptanceDate.plusMonths(termLengthMonths)
    Days.daysBetween(contractEffectiveDate, termEnd).getDays
  }
}
