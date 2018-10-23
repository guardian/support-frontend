package com.gu.support.workers

import cats.implicits._
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.lambdas.IdentityId
import com.gu.support.workers.model.AccessScope.{AccessScopeBySessionId, AccessScopeNoRestriction, SessionId}
import com.gu.support.workers.model.{AccessScope, BillingPeriod}
import com.gu.zuora.GetAccountForIdentity.{CreatedInSession, DomainAccount, ExistingContributionSessionId}
import com.gu.zuora.GetSubscription.DomainSubscription
import com.gu.zuora.ZuoraConfig.RatePlanId
import com.gu.zuora.ZuoraService
import com.gu.zuora.model.response.RatePlan

import scala.concurrent.{ExecutionContext, Future}

object GetRecurringSubscription {

  def apply(
    zuoraService: ZuoraService,
    accessScope: AccessScope,
    identityId: IdentityId,
    billingPeriod: BillingPeriod
  )(implicit ec: ExecutionContext): Future[Option[DomainSubscription]] = {

    val productRatePlanId: RatePlanId = zuoraService.config.contributionConfig(billingPeriod).productRatePlanId

    val hasContributorPlan: List[RatePlan] => Boolean = GetRecurringSubscription.hasContributorPlan(productRatePlanId)

    def isInScope(domainAccount: DomainAccount): Boolean =
      IsSubscriptionAccessAllowed(accessScope, domainAccount.existingContributionSessionId)
        .withLogging(s"isInScope, access scope: $accessScope, account: $domainAccount")

    for {
      accountIds <- zuoraService.getAccountFields(identityId)
      inScopeAccountIds = accountIds.filter(isInScope).map(_.accountNumber)
      subscriptions <- inScopeAccountIds.map(zuoraService.getSubscriptions).combineAll
      maybeRecentContributor = subscriptions.find(sub => hasContributorPlan(sub.ratePlans) && sub.isActive.value)
    } yield maybeRecentContributor
  }

  def hasContributorPlan(ratePlanId: RatePlanId)(ratePlans: List[RatePlan]): Boolean =
    ratePlans.exists(_.productRatePlanId == ratePlanId)

  implicit class LogImplicit[A](op: A) {

    def withLogging(message: String): A = {
      SafeLogger.info(s"$message: result: $op")
      op
    }

  }

}

object IsSubscriptionAccessAllowed {

  def apply(accessScope: AccessScope, existingContributionSessionId: ExistingContributionSessionId): Boolean = {
    (accessScope, existingContributionSessionId) match {
      case (AccessScopeNoRestriction, _) => true
      case (AccessScopeBySessionId(currentSessionId), CreatedInSession(existingSubSession)) if currentSessionId == existingSubSession => true
      case _ => false
    }
  }

}
