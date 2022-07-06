package com.gu.zuora.productHandlers

import cats.syntax.all._
import com.gu.WithLoggingSugar._
import com.gu.support.acquisitions.{AbTest, AcquisitionData}
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionDirectPurchaseState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionDirectPurchaseBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionDirectHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    digitalSubscriptionDirectPurchaseBuilder: DigitalSubscriptionDirectPurchaseBuilder,
    user: User,
) {

  def subscribe(
      state: DigitalSubscriptionDirectPurchaseState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
      acquisitionData: Option[AcquisitionData],
  ): Future[SendThankYouEmailState] = {
    for {
      subscribeItem <- Future
        .fromTry(
          digitalSubscriptionDirectPurchaseBuilder
            .build(state, csrUsername, salesforceCaseId, acquisitionData)
            .leftMap(BuildSubscribePromoError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
      user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      state.promoCode,
      account.value,
      sub.value,
    )
  }

}
