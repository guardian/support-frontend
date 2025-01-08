package com.gu.zuora.productHandlers

import com.gu.support.acquisitions.AcquisitionData
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianAdLightState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianAdLightState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.GuardianAdLightSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianAdLightHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    subscriptionBuilder: GuardianAdLightSubscriptionBuilder,
    user: User,
) {

  def subscribe(
      state: GuardianAdLightState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] = {
    val subscribeItem = subscriptionBuilder.build(state, csrUsername, salesforceCaseId)

    for {
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailGuardianAdLightState(
      user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      account.value,
      sub.value,
    )

  }
}
