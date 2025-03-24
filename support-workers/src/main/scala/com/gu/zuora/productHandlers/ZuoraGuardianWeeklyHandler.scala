package com.gu.zuora.productHandlers

import cats.implicits._
import scala.util.Try
import com.gu.WithLoggingSugar._
import com.gu.support.workers.GuardianWeekly
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianWeeklyState
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianWeeklyHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    guardianWeeklySubscriptionBuilder: GuardianWeeklySubscriptionBuilder,
) {

  def subscribe(
      product: GuardianWeekly,
      state: CreateZuoraSubscriptionState,
  ): Future[SendThankYouEmailState] = {
    val firstDeliveryDate =
      state.firstDeliveryDate.toRight(new IllegalStateException("firstDeliveryDate is required")).toTry
    for {
      firstDeliveryDate <- Future.fromTry(firstDeliveryDate)
      subscribeItem <- Future
        .fromTry(
          guardianWeeklySubscriptionBuilder
            .build(product, state)
            .leftMap(BuildSubscribeError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailGuardianWeeklyState(
      state.user,
      product,
      state.giftRecipient,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
      firstDeliveryDate,
    )
  }

}
