package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{BuildSubscribePromoError, DigitalSubscriptionGiftPurchaseBuilder}
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionGiftPurchaseHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  now: () => DateTime,
  digitalSubscriptionGiftPurchaseBuilder: DigitalSubscriptionGiftPurchaseBuilder,
  user: User,
) {

  def subscribe(state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- Future.fromTry(digitalSubscriptionGiftPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(subscribeItem, state.product.billingPeriod)
        .withEventualLogging("update redemption code")
    } yield {
      val giftCode = subscribeItem.subscriptionData.subscription.redemptionCode.flatMap(_.left.toOption)
      val lastRedemptionDate = (() => now().toLocalDate) ().plusMonths(GiftCodeValidator.expirationTimeInMonths).minusDays(1)
      state.nextState(paymentSchedule, giftCode.get, lastRedemptionDate, account, sub, user)
    }

}
