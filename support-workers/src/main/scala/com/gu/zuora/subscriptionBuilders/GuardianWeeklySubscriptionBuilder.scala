package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{DefaultPromotions, PromoCode, PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianWeeklyState
import com.gu.support.workers.{BillingPeriod, SixWeekly}
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

  def build(state: GuardianWeeklyState, csrUsername: Option[String], salesforceCaseId: Option[String]): Either[PromoError, SubscribeItem] = {

    val contractEffectiveDate = dateGenerator.today

    val readerType = if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct

    val recurringProductRatePlanId = validateRatePlan(weeklyRatePlan(state.product, environment, readerType), state.product.describe)

    val promotionProductRatePlanId = if (isIntroductoryPromotion(state.product.billingPeriod, state.promoCode)) {
      weeklyIntroductoryRatePlan(state.product, environment).map(_.id).getOrElse(recurringProductRatePlanId)
    } else recurringProductRatePlanId

    val (initialTerm, autoRenew, initialTermPeriodType) = if (readerType == ReaderType.Gift)
      (initialTermInDays(contractEffectiveDate, state.firstDeliveryDate, state.product.billingPeriod.monthsInPeriod), false, Day)
    else
      (12, true, Month)

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      recurringProductRatePlanId,
      contractAcceptanceDate = state.firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = readerType,
      autoRenew = autoRenew,
      initialTerm = initialTerm,
      initialTermPeriodType = initialTermPeriodType,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.promoCode,
      state.user.deliveryAddress.getOrElse(state.user.billingAddress).country,
      promotionProductRatePlanId,
      subscriptionData
    ).map { subscriptionData =>
      val soldToContact = state.giftRecipient match {
        case None =>
          SubscribeItemBuilder.buildContactDetails(Some(state.user.primaryEmailAddress), state.user.firstName, state.user.lastName, state.user.deliveryAddress.get, None)
        case Some(gR) =>
          SubscribeItemBuilder.buildContactDetails(gR.email, gR.firstName, gR.lastName, state.user.deliveryAddress.get, None)
      }
      subscribeItemBuilder.build(subscriptionData, state.salesforceContacts.recipient, Some(state.paymentMethod), Some(soldToContact))
    }
  }

  private[this] def isIntroductoryPromotion(billingPeriod: BillingPeriod, maybePromoCode: Option[PromoCode]) =
    maybePromoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix) && billingPeriod == SixWeekly

}
object GuardianWeeklySubscriptionBuilder {
  def initialTermInDays(contractEffectiveDate: LocalDate, contractAcceptanceDate: LocalDate, termLengthMonths: Int): Int = {
    val termEnd = contractAcceptanceDate.plusMonths(termLengthMonths)
    Days.daysBetween(contractEffectiveDate, termEnd).getDays
  }
}
