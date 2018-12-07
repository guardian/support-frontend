package com.gu.support.workers

import java.util.UUID

import cats.implicits._
import com.gu.monitoring.SafeLogger
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.zuora.api.response.RatePlan
import com.gu.support.zuora.domain.{CreatedRequestId, DomainAccount, DomainSubscription}
import com.gu.zuora.ZuoraService

import scala.concurrent.{ExecutionContext, Future}

object GetRecurringSubscription {

  def apply(
    zuoraService: ZuoraService,
    requestId: UUID,
    identityId: IdentityId,
    billingPeriod: BillingPeriod
  )(implicit ec: ExecutionContext): Future[Option[DomainSubscription]] = {

    val productRatePlanId: ProductRatePlanId = zuoraService.config.contributionConfig(billingPeriod).productRatePlanId

    val hasContributorPlan: List[RatePlan] => Boolean = GetRecurringSubscription.hasContributorPlan(productRatePlanId)

    def isAccountAccessAllowed(domainAccount: DomainAccount): Boolean =
      IsSameRequest(requestId, domainAccount.existingAccountRequestId)
        .withLogging(s"isInScope, access scope: $requestId, account: $domainAccount")

    for {
      accountIds <- zuoraService.getAccountFields(identityId)
      inScopeAccountIds = accountIds.filter(isAccountAccessAllowed).map(_.accountNumber)
      subscriptions <- inScopeAccountIds.map(zuoraService.getSubscriptions).combineAll
      maybeRecentContributor = subscriptions.find(sub => hasContributorPlan(sub.ratePlans) && sub.isActive.value)
    } yield maybeRecentContributor
  }

  def hasContributorPlan(ratePlanId: ProductRatePlanId)(ratePlans: List[RatePlan]): Boolean =
    ratePlans.exists(_.productRatePlanId == ratePlanId)

  implicit class LogImplicit[A](op: A) {

    def withLogging(message: String): A = {
      SafeLogger.info(s"$message: result: $op")
      op
    }

  }

}

object IsSameRequest {

  def apply(requestId: UUID, existingAccountSessionId: Option[CreatedRequestId]): Boolean =
    existingAccountSessionId.map(_.value).contains(requestId.toString)

}
