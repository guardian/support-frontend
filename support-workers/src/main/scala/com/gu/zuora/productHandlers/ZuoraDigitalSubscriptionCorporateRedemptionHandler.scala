package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.support.redemption.corporate.{CorporateCodeStatusUpdater, RedemptionTable}
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{BuildSubscribeRedemptionError, DigitalSubscriptionCorporateRedemptionBuilder}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionCorporateRedemptionHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  corporateCodeStatusUpdater: CorporateCodeStatusUpdater,
  digitalSubscriptionCorporateRedemptionBuilder: DigitalSubscriptionCorporateRedemptionBuilder,
) {

  def subscribe(state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- digitalSubscriptionCorporateRedemptionBuilder.build(state)
        .leftMap(BuildSubscribeRedemptionError).value.map(_.toTry).flatMap(Future.fromTry)
        .withEventualLogging("subscription data")
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(state, subscribeItem)
      _ <- corporateCodeStatusUpdater.setStatus(state.redemptionData.redemptionCode, RedemptionTable.AvailableField.CodeIsUsed)
        .withEventualLogging("update redemption code")
    } yield state.nextState(account, sub)

}
