package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.acquisitions.{AbTest, AcquisitionData}
import com.gu.support.workers.{DigitalPack, User}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionState
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    digitalSubscriptionBuilder: DigitalSubscriptionBuilder,
    user: User,
) {

  def subscribe(
      product: DigitalPack,
      state: CreateZuoraSubscriptionState,
  ): Future[SendThankYouEmailState] = {
    for {
      subscribeItem <- Future
        .fromTry(
          digitalSubscriptionBuilder
            .build(product, state)
            .leftMap(BuildSubscribeError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailDigitalSubscriptionState(
      user,
      product,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
    )
  }

}
