package com.gu.zuora.subscriptionBuilders

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
  now: () => LocalDate
) {

  def build(state: CreateZuoraSubscriptionGuardianWeeklyState): Either[PromoError, SubscribeItem] = {

    val contractEffectiveDate = now()

    import state._
    val readerType = if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct

    val recurringProductRatePlanId = validateRatePlan(weeklyRatePlan(product, environment, readerType), product.describe)

    val promotionProductRatePlanId = if (isIntroductoryPromotion(product.billingPeriod, promoCode)) {
      weeklyIntroductoryRatePlan(product, environment).map(_.id).getOrElse(recurringProductRatePlanId)
    } else recurringProductRatePlanId

    val (initialTerm, autoRenew, initialTermPeriodType) = if (readerType == ReaderType.Gift)
      (initialTermInDays(contractEffectiveDate, firstDeliveryDate, product.billingPeriod.monthsInPeriod), false, Day)
    else
      (12, true, Month)

    val subscriptionData = SubscriptionData(
      List(
        RatePlanData(
          RatePlan(recurringProductRatePlanId),
          Nil,
          Nil
        )
      ),
      Subscription(
        contractEffectiveDate = contractEffectiveDate,
        contractAcceptanceDate = firstDeliveryDate,
        termStartDate = contractEffectiveDate,
        createdRequestId = requestId.toString,
        readerType = readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm,
        initialTermPeriodType = initialTermPeriodType,
      )
    )

    applyPromoCodeIfPresent(promotionService, promoCode, user.billingAddress.country, promotionProductRatePlanId, subscriptionData).map { subscriptionData =>
      val soldToContact = state.giftRecipient match {
        case None =>
          SubscribeItemBuilder.buildContactDetails(Some(user.primaryEmailAddress), user.firstName, user.lastName, user.deliveryAddress.get, None)
        case Some(gR) =>
          SubscribeItemBuilder.buildContactDetails(gR.email, gR.firstName, gR.lastName, user.deliveryAddress.get, None)
      }
      SubscribeItemBuilder.buildSubscribeItem(state, subscriptionData, salesforceContacts.recipient, Some(paymentMethod), Some(soldToContact))
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
