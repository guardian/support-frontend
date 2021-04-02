package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionGuardianWeeklyState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianWeeklyHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  guardianWeeklySubscriptionBuilder: GuardianWeeklySubscriptionBuilder,
) {

  def subscribe(state: CreateZuoraSubscriptionGuardianWeeklyState): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future.fromTry(guardianWeeklySubscriptionBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(subscribeItem, state.product.billingPeriod)
    } yield state.nextState(paymentSchedule, account, sub)

}
















