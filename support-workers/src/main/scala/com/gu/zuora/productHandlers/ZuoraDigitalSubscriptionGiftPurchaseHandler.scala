package com.gu.zuora.productHandlers

import cats.syntax.all._
import com.gu.WithLoggingSugar._
import com.gu.helpers.DateGenerator
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionGiftPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionGiftPurchaseState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionGiftPurchaseBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionGiftPurchaseHandler(
    zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
    dateGenerator: DateGenerator,
    digitalSubscriptionGiftPurchaseBuilder: DigitalSubscriptionGiftPurchaseBuilder,
    user: User,
) {

  def subscribe(
      state: DigitalSubscriptionGiftPurchaseState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Future[SendThankYouEmailState] =
    for {
      subscriptionBuildResult <- Future
        .fromTry(
          digitalSubscriptionGiftPurchaseBuilder
            .build(state, csrUsername, salesforceCaseId)
            .leftMap(BuildSubscribePromoError)
            .toTry,
        )
        .withEventualLogging("subscription data")
      (subscribeItem, giftCode) = subscriptionBuildResult
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield {
      val lastRedemptionDate =
        (() => dateGenerator.today)().plusMonths(GiftCodeValidator.expirationTimeInMonths).minusDays(1)
      SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
        user,
        SfContactId(state.salesforceContacts.giftRecipient.get.Id),
        state.product,
        state.giftRecipient,
        giftCode,
        lastRedemptionDate,
        state.paymentMethod,
        paymentSchedule,
        state.promoCode,
        account.value,
        sub.value,
      )
    }

}
