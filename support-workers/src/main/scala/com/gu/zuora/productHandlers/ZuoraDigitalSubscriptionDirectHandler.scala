package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{BuildSubscribePromoError, DigitalSubscriptionDirectPurchaseBuilder}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionDirectHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  digitalSubscriptionDirectPurchaseBuilder: DigitalSubscriptionDirectPurchaseBuilder,
) {

  def subscribe(state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future.fromTry(digitalSubscriptionDirectPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(state, subscribeItem)
    } yield state.nextState(paymentSchedule, account, sub)

}
