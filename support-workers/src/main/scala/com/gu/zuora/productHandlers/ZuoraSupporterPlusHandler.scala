package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.SupporterPlusState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailSupporterPlusState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.SupporterPlusSubcriptionBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraSupporterPlusHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    supporterPlusSubscriptionBuilder: SupporterPlusSubcriptionBuilder,
    user: User,
) {
  def subscribe(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailSupporterPlusState] =
    for {
      subscribeItem <- Future.fromTry(
        supporterPlusSubscriptionBuilder
          .build(state, csrUsername, salesforceCaseId)
          .leftMap(BuildSubscribePromoError)
          .toTry,
      )
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield SendThankYouEmailSupporterPlusState(
      user,
      state.product,
      state.productInformation,
      state.paymentMethod,
      paymentSchedule,
      state.appliedPromotion.map(_.promoCode),
      account.value,
      sub.value,
      state.similarProductsConsent,
    )

}
