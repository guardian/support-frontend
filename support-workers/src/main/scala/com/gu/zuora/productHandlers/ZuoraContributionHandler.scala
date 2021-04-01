package com.gu.zuora.productHandlers

import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionContributionState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.ContributionSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraContributionHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  contributionSubscriptionBuilder: ContributionSubscriptionBuilder,
) {

  def subscribe(state: CreateZuoraSubscriptionContributionState): Future[SendThankYouEmailState] =
    for {
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(state, contributionSubscriptionBuilder.build(state))
    } yield state.nextState(account, sub)

}
