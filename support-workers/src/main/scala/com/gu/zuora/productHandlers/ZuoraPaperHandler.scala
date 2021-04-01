package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionPaperState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{BuildSubscribePromoError, PaperSubscriptionBuilder}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraPaperHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  paperSubscriptionBuilder: PaperSubscriptionBuilder,
) {

  def subscribe(state: CreateZuoraSubscriptionPaperState): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future.fromTry(paperSubscriptionBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(state, subscribeItem)
    } yield state.nextState(paymentSchedule, account, sub)

}
