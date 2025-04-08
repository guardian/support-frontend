package com.gu.zuora.productHandlers

import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianAdLiteState
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.workers.{GuardianAdLite, User}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.GuardianAdLiteSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianAdLiteHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    subscriptionBuilder: GuardianAdLiteSubscriptionBuilder,
    user: User,
) {

  def subscribe(
      product: GuardianAdLite,
      state: CreateZuoraSubscriptionState,
  ): Future[SendThankYouEmailState] = {
    val subscribeItem = subscriptionBuilder.build(product, state)

    for {
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailGuardianAdLiteState(
      user,
      product,
      state.paymentMethod,
      paymentSchedule,
      account.value,
      sub.value,
    )

  }
}
