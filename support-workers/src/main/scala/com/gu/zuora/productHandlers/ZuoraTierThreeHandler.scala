package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.TierThree
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailTierThreeState
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraTierThreeHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    tierThreeSubscriptionBuilder: TierThreeSubscriptionBuilder,
) {

  def subscribe(
      product: TierThree,
      state: CreateZuoraSubscriptionState,
  ): Future[SendThankYouEmailState] = {
    for {
      firstDeliveryDate <- Future.fromTry(
        state.firstDeliveryDate
          .toRight("First delivery date is required for a Tier Three subscription")
          .leftMap(BuildSubscribeError)
          .toTry,
      )
      subscribeItem <- Future
        .fromTry(
          tierThreeSubscriptionBuilder
            .build(product, state)
            .leftMap(BuildSubscribeError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailTierThreeState(
      state.user,
      product,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
      firstDeliveryDate,
    )
  }

}
