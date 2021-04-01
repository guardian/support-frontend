package com.gu.zuora.productHandlers

import com.gu.support.config.ZuoraConfig
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionContributionState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.buildContributionSubscription

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraContributionHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  config: ZuoraConfig,
) {

  def subscribe(state: CreateZuoraSubscriptionContributionState): Future[SendThankYouEmailState] =
    for {
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(state, buildContributionSubscription(state, config.contributionConfig))
    } yield state.nextState(account, sub)

}
