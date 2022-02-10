package com.gu.support.workers

import java.util.UUID
import cats.implicits._
import com.gu.WithLoggingSugar.LogImplicitFuture
import com.gu.helpers.DateGenerator
import com.gu.support.zuora.domain.{CreatedRequestId, DomainSubscription}
import com.gu.zuora.ZuoraSubscribeService
import org.joda.time.DateTime

import scala.concurrent.{ExecutionContext, Future}

object GetSubscriptionWithCurrentRequestId {

  def apply(
      zuoraService: ZuoraSubscribeService,
      requestId: UUID,
      identityId: IdentityId,
      dateGenerator: DateGenerator,
  )(implicit ec: ExecutionContext): Future[Option[DomainSubscription]] = for {
    accountNumbers <- zuoraService
      .getAccountFields(identityId, dateGenerator.now)
      .withEventualLogging("getAccountFields")
    subscriptions <- accountNumbers
      .map(_.accountNumber)
      .map { zuoraAccountNumber =>
        zuoraService.getSubscriptions(zuoraAccountNumber).withEventualLogging(s"getSubscriptions($zuoraAccountNumber)")
      }
      .combineAll
      .withEventualLogging("combineAll")
  } yield subscriptions.find(subscription =>
    CreatedBySameRequest(requestId, subscription.existingSubscriptionRequestId),
  )

}

object CreatedBySameRequest {

  def apply(requestId: UUID, existingSubscriptionRequestId: Option[CreatedRequestId]): Boolean =
    existingSubscriptionRequestId.map(_.value).contains(requestId.toString)

}
