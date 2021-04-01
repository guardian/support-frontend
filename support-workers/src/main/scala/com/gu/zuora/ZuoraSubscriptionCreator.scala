package com.gu.zuora

import com.gu.WithLoggingSugar._
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionNewSubscriptionState
import com.gu.support.workers.{GetSubscriptionWithCurrentRequestId, IdentityId, PaymentSchedule, PreviewPaymentSchedule}
import com.gu.support.zuora.api.{SubscribeItem, _}
import com.gu.support.zuora.api.response.{ZuoraAccountNumber, ZuoraSubscriptionNumber}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.ZuoraSubscriptionCreator.checkSingleResponse
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraSubscriptionCreator(zuoraService: ZuoraSubscribeService, now: () => DateTime) {

  def ensureSubscriptionCreatedWithPreview(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    subscribeItem: SubscribeItem
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber, PaymentSchedule)] =
    for {
      paymentSchedule <- PreviewPaymentSchedule.preview(subscribeItem, state.product.billingPeriod, zuoraService, checkSingleResponse)
        .withEventualLogging("PreviewPaymentSchedule")
      (account, sub) <- ensureSubscriptionCreated(state, subscribeItem)
    } yield (account, sub, paymentSchedule)

  def ensureSubscriptionCreated(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    subscribeItem: SubscribeItem
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber)] =
    for {
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withEventualLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withEventualLogging("GetSubscriptionWithCurrentRequestId")
      (account, sub) <- ZuoraSubscriptionCreator.subscribeIfApplicable(zuoraService, subscribeItem, maybeDomainSubscription)
        .withEventualLogging("subscribe")
    } yield (account, sub)

}

object ZuoraSubscriptionCreator {

  def subscribeIfApplicable(
    zuoraService: ZuoraSubscribeService,
    subscribeItem: SubscribeItem,
    maybeDomainSubscription: Option[DomainSubscription]
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber)] =
    maybeDomainSubscription match {
      case Some(domainSubscription) =>
        SafeLogger.info("Skipping subscribe for user because a subscription has already been created for this request")
        Future.successful((domainSubscription.accountNumber, domainSubscription.subscriptionNumber))
      case None => checkSingleResponse(zuoraService.subscribe(SubscribeRequest(List(subscribeItem)))).map { response =>
        (response.domainAccountNumber, response.domainSubscriptionNumber)
      }
    }

  def checkSingleResponse[ResponseItem](response: Future[List[ResponseItem]]): Future[ResponseItem] = {
    response.flatMap {
      case result :: Nil => Future.successful(result)
      case results => Future.failed(new RuntimeException(s"didn't get a single response item, got: $results"))
    }
  }

}
