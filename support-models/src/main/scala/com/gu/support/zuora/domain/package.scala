package com.gu.support.zuora

import com.gu.support.zuora.api.response._

package object domain {

  case class ZuoraIsActive(value: Boolean) extends AnyVal

  case class DomainSubscription(
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
      isActive: ZuoraIsActive,
      existingSubscriptionRequestId: Option[CreatedRequestId],
      ratePlans: List[RatePlan],
  )

  object DomainSubscription {
    def fromSubscription(subscription: Subscription): DomainSubscription =
      DomainSubscription(
        ZuoraAccountNumber(subscription.accountNumber),
        ZuoraSubscriptionNumber(subscription.subscriptionNumber),
        ZuoraIsActive(subscription.status == "Active"),
        subscription.CreatedRequestId__c.filter(_.length > 0).map(CreatedRequestId.apply),
        subscription.ratePlans, // this can be changed to map to a DomainRatePlan if necessary
      )
  }

  case class CreatedRequestId(value: String)

  case class DomainAccount(accountNumber: ZuoraAccountNumber, existingAccountRequestId: Option[CreatedRequestId])

  object DomainAccount {

    def fromAccountRecord(accountRecord: AccountRecord): DomainAccount =
      DomainAccount(
        ZuoraAccountNumber(accountRecord.AccountNumber),
        accountRecord.CreatedRequestId__c.filter(_.length > 0).map(CreatedRequestId.apply),
      )

  }

}
