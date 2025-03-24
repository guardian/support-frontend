package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.Paper
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailPaperState
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.PaperSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraPaperHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    paperSubscriptionBuilder: PaperSubscriptionBuilder,
) {

  def subscribe(
      product: Paper,
      state: CreateZuoraSubscriptionState,
  ): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future
        .fromTry(
          paperSubscriptionBuilder.build(product, state).leftMap(BuildSubscribeError).toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailPaperState(
      state.user,
      product,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
      state.firstDeliveryDate,
    )

}
