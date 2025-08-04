package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.TierThreeState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailTierThreeState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraTierThreeHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    tierThreeSubscriptionBuilder: TierThreeSubscriptionBuilder,
) {

  def subscribe(
      state: TierThreeState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future
        .fromTry(
          tierThreeSubscriptionBuilder
            .build(state, csrUsername, salesforceCaseId)
            .leftMap(BuildSubscribePromoError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailTierThreeState(
      state.user,
      state.product,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
      state.firstDeliveryDate,
      state.similarProductsConsent,
    )

}
