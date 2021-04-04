package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionDirectPurchaseState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{BuildSubscribePromoError, DigitalSubscriptionDirectPurchaseBuilder}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionDirectHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  digitalSubscriptionDirectPurchaseBuilder: DigitalSubscriptionDirectPurchaseBuilder,
  user: User,
) {

  def subscribe(state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future.fromTry(digitalSubscriptionDirectPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(subscribeItem, state.product.billingPeriod)
    } yield SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
      user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      state.promoCode,
      account.value,
      sub.value
    )

}
