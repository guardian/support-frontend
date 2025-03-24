package com.gu.zuora.productHandlers

import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailContributionState
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.workers.{Contribution, User}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.ContributionSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraContributionHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    contributionSubscriptionBuilder: ContributionSubscriptionBuilder,
    user: User,
) {

  def subscribe(product: Contribution, state: CreateZuoraSubscriptionState): Future[SendThankYouEmailState] =
    for {
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(
        contributionSubscriptionBuilder.build(product, state),
      )
    } yield SendThankYouEmailContributionState(user, product, state.paymentMethod, account.value, sub.value)

}
