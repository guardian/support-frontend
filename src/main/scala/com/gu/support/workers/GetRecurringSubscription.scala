package com.gu.support.workers

import cats.implicits._
import com.gu.support.workers.lambdas.IdentityId
import com.gu.support.workers.model.AccessScope.{AccessScopeBySessionId, AccessScopeNoRestriction, SessionId}
import com.gu.support.workers.model.{AccessScope, BillingPeriod}
import com.gu.zuora.GetAccountForIdentity.DomainAccount
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

    val productRatePlanId = Option(zuoraService.config).map(_.contributionConfig(billingPeriod).productRatePlanId)

    def hasContributorPlan(sub: DomainSubscription): Boolean =
      productRatePlanId match {
        case Some(productRatePlanId) => GetRecurringSubscription.hasContributorPlan(productRatePlanId, sub.ratePlans)
        case None => false
      }

    def isInScope(domainAccount: DomainAccount): Boolean =
      GetRecurringSubscription.isInAccessScope(accessScope, domainAccount.maybeCreatedSessionId)

    for {
      accountIds <- zuoraService.getAccountFields(identityId)
      inScopeAccountIds = accountIds.filter(isInScope).map(_.accountNumber)
      subscriptions <- inScopeAccountIds.map(zuoraService.getSubscriptions).combineAll
      maybeRecentCont = subscriptions.find(sub => hasContributorPlan(sub) && sub.isActive.value)
    } yield maybeRecentCont
  }

  def isInAccessScope(accessScope: AccessScope, maybeCreatedSessionId: Option[SessionId]): Boolean = {
    (accessScope, maybeCreatedSessionId) match {
      case (AccessScopeNoRestriction, _) => true
      case (AccessScopeBySessionId(currentSessionId), Some(existingSubSession)) if currentSessionId == existingSubSession => true
      case _ => false
    }
  }

  def hasContributorPlan(ratePlanId: RatePlanId, ratePlans: List[RatePlan]): Boolean =
    ratePlans.exists(_.productRatePlanId == ratePlanId)

}
