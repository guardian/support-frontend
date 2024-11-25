package com.gu.zuora.productHandlers

import com.gu.support.acquisitions.AcquisitionData
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianLightState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianLightState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.GuardianLightSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianLightHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    subscriptionBuilder: GuardianLightSubscriptionBuilder,
    user: User,
) {

  def subscribe(
      state: GuardianLightState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] = {
    val subscribeItem = subscriptionBuilder.build(state, csrUsername, salesforceCaseId)

    for {
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailGuardianLightState(
      user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      account.value,
      sub.value,
    )

  }
}
