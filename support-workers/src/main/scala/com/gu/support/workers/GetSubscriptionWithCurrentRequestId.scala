package com.gu.support.workers

import java.util.UUID

import cats.implicits._
import com.gu.support.zuora.domain.{CreatedRequestId, DomainSubscription}
import com.gu.zuora.ZuoraService

import scala.concurrent.{ExecutionContext, Future}

object GetSubscriptionWithCurrentRequestId {

  def apply(
    zuoraService: ZuoraService,
    requestId: UUID,
    identityId: IdentityId,
    billingPeriod: BillingPeriod
  )(implicit ec: ExecutionContext): Future[Option[DomainSubscription]] = for {
    accountNumbers <- zuoraService.getAccountFields(identityId)
    subscriptions <- accountNumbers.map(_.accountNumber).map(zuoraService.getSubscriptions).combineAll
  } yield subscriptions.find(subscription => CreatedBySameRequest(requestId, subscription.existingSubscriptionRequestId))

}

object CreatedBySameRequest {

  def apply(requestId: UUID, existingSubscriptionRequestId: Option[CreatedRequestId]): Boolean =
    existingSubscriptionRequestId.map(_.value).contains(requestId.toString)

}
