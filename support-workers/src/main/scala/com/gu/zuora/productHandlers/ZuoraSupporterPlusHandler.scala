package com.gu.zuora.productHandlers

import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{ContributionState, SupporterPlusState}
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailContributionState,
  SendThankYouEmailSupporterPlusState,
}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{ContributionSubscriptionBuilder, SupporterPlusSubcriptionBuilder}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraSupporterPlusHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    supporterPlusSubscriptionBuilder: SupporterPlusSubcriptionBuilder,
    user: User,
) {
  def subscribe(state: SupporterPlusState, csrUsername: Option[String], salesforceCaseId: Option[String]) =
    for {
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(
        supporterPlusSubscriptionBuilder.build(state, csrUsername, salesforceCaseId),
      )
    } yield SendThankYouEmailSupporterPlusState(user, state.product, state.paymentMethod, account.value, sub.value)

}
