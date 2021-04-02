package com.gu.zuora.productHandlers

import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionContributionState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.ContributionSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraContributionHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  contributionSubscriptionBuilder: ContributionSubscriptionBuilder,
  user: User,
) {

  def subscribe(state: CreateZuoraSubscriptionContributionState): Future[SendThankYouEmailState] =
    for {
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(contributionSubscriptionBuilder.build(state))
    } yield state.nextState(account, sub, user)

}
