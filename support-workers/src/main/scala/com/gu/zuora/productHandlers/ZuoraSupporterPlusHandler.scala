package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailSupporterPlusState
import com.gu.support.workers.{SupporterPlus, User}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.SupporterPlusSubcriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraSupporterPlusHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    supporterPlusSubscriptionBuilder: SupporterPlusSubcriptionBuilder,
    user: User,
) {
  def subscribe(
      product: SupporterPlus,
      state: CreateZuoraSubscriptionState,
  ): Future[SendThankYouEmailSupporterPlusState] =
    for {
      subscribeItem <- Future.fromTry(
        supporterPlusSubscriptionBuilder
          .build(product, state)
          .leftMap(BuildSubscribeError)
          .toTry,
      )
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailSupporterPlusState(
      user,
      product,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
    )

}
