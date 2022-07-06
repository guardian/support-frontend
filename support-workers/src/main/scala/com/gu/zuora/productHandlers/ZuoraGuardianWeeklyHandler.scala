package com.gu.zuora.productHandlers

import cats.syntax.all._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianWeeklyState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianWeeklyState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianWeeklyHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    guardianWeeklySubscriptionBuilder: GuardianWeeklySubscriptionBuilder,
) {

  def subscribe(
      state: GuardianWeeklyState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future
        .fromTry(
          guardianWeeklySubscriptionBuilder
            .build(state, csrUsername, salesforceCaseId)
            .leftMap(BuildSubscribePromoError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailGuardianWeeklyState(
      state.user,
      state.product,
      state.giftRecipient,
      state.paymentMethod,
      paymentSchedule,
      state.promoCode,
      account.value,
      sub.value,
      state.firstDeliveryDate,
    )

}
