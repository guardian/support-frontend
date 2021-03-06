package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionDirectPurchaseState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionDirectPurchaseBuilder
import ophan.thrift.event.AbTest

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionDirectHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  digitalSubscriptionDirectPurchaseBuilder: DigitalSubscriptionDirectPurchaseBuilder,
  user: User,
) {

  def isUserInEventsTest(maybeAbTests: Option[Set[AbTest]]) =
    maybeAbTests.exists(_.toList.exists(test => test.name == "digiSubEventsTest" && test.variant == "variant"))

  def subscribe(state: DigitalSubscriptionDirectPurchaseState, maybeAbTests: Option[Set[AbTest]]): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future.fromTry(digitalSubscriptionDirectPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
      user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      state.promoCode,
      account.value,
      sub.value,
      Some(isUserInEventsTest(maybeAbTests)),
    )

}
