package com.gu.zuora

import com.gu.WithLoggingSugar._
import com.gu.helpers.DateGenerator
import com.gu.monitoring.SafeLogger
import com.gu.support.workers._
import com.gu.support.zuora.api.response.{ZuoraAccountNumber, ZuoraSubscriptionNumber}
import com.gu.support.zuora.api.{SubscribeItem, _}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.ZuoraSubscriptionCreator.checkSingleResponse

import java.util.UUID
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraSubscriptionCreator(
    zuoraService: ZuoraSubscribeService,
    dateGenerator: DateGenerator,
    userId: String,
    requestId: UUID,
) {

  def preview(
      subscribeItem: SubscribeItem,
      billingPeriod: BillingPeriod,
  ): Future[PaymentSchedule] =
    PreviewPaymentSchedule
      .preview(subscribeItem, billingPeriod, zuoraService, checkSingleResponse)
      .withEventualLogging("PreviewPaymentSchedule")

  def ensureSubscriptionCreated(subscribeItem: SubscribeItem): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber)] =
    for {
      identityId <- Future
        .fromTry(IdentityId(userId))
        .withEventualLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, requestId, identityId, dateGenerator)
        .withEventualLogging("GetSubscriptionWithCurrentRequestId")
      (account, sub) <- ZuoraSubscriptionCreator
        .subscribeIfApplicable(zuoraService, subscribeItem, maybeDomainSubscription)
        .withEventualLogging("subscribe")
    } yield (account, sub)

}

object ZuoraSubscriptionCreator {

  def subscribeIfApplicable(
      zuoraService: ZuoraSubscribeService,
      subscribeItem: SubscribeItem,
      maybeDomainSubscription: Option[DomainSubscription],
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber)] =
    maybeDomainSubscription match {
      case Some(domainSubscription) =>
        SafeLogger.info("Skipping subscribe for user because a subscription has already been created for this request")
        Future.successful((domainSubscription.accountNumber, domainSubscription.subscriptionNumber))
      case None =>
        checkSingleResponse(zuoraService.subscribe(SubscribeRequest(List(subscribeItem)))).map { response =>
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
