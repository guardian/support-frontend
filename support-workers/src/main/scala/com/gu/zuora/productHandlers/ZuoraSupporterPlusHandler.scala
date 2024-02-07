package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.SupporterPlusState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailSupporterPlusState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.SupporterPlusSubcriptionBuilder
import scala.concurrent.Future

class ZuoraSupporterPlusHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    supporterPlusSubscriptionBuilder: SupporterPlusSubcriptionBuilder,
    user: User,
) {
  def subscribe(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ) =
    for {
      subscribeItem <- Future
        .fromTry(
          supporterPlusSubscriptionBuilder
            .build(state, csrUsername, salesforceCaseId)
            .leftMap(BuildSubscribePromoError)
            .toTry,
        )
        .withEventualLogging("SupporterPlus subscription data")
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailSupporterPlusState(
      user,
      state.product,
      state.paymentMethod,
      account.value,
      sub.value,
    )

}
