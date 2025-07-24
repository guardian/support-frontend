package com.gu.zuora.productHandlers

import com.gu.support.acquisitions.AcquisitionData
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianAdLiteState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianAdLiteState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.GuardianAdLiteSubscriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraGuardianAdLiteHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    subscriptionBuilder: GuardianAdLiteSubscriptionBuilder,
    user: User,
) {

  def subscribe(
      state: GuardianAdLiteState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] = {
    val subscribeItem = subscriptionBuilder.build(state, csrUsername, salesforceCaseId)

    for {
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailGuardianAdLiteState(
      user,
      state.product,
      state.productInformation,
      state.paymentMethod,
      paymentSchedule,
      account.value,
      sub.value,
      similarProductsConsent = None, // Guardian Ad Lite does not ask for similar products consent
    )

  }
}
