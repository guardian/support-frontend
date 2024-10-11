package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.PaperState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailPaperState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.PaperSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraPaperHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    paperSubscriptionBuilder: PaperSubscriptionBuilder,
) {

  def subscribe(
      state: PaperState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future
        .fromTry(
          paperSubscriptionBuilder.build(state, csrUsername, salesforceCaseId).leftMap(BuildSubscribePromoError).toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailPaperState(
      state.user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      state.promoCode,
      account.value,
      sub.value,
      state.firstDeliveryDate,
    )

}
