package com.gu.model

case class FieldDefinition(zuoraName: String, dynamoName: String)

object FieldsToExport {
  val subscriptionName = FieldDefinition(
    "Subscription.Name",
    "subscriptionName"
  )
  val identityId = FieldDefinition(
    "Account.IdentityId__c",
    "identityId"
  )
  val gifteeIdentityId = FieldDefinition(
    "Subscription.GifteeIdentityId__c",
    "identityId"
  )
  val productRatePlanName = FieldDefinition(
    "ProductRatePlan.Name",
    "productRatePlanName"
  )
  val productRatePlanId = FieldDefinition(
    "ProductRatePlan.Id",
    "productRatePlanId"
  )
  val termEndDate = FieldDefinition(
    "Subscription.TermEndDate",
    "termEndDate"
  )
  val contractEffectiveDate = FieldDefinition(
    "Subscription.ContractEffectiveDate",
    "contractEffectiveDate"
  )

  val subscriptionStatus = FieldDefinition(
    "Subscription.Status",
    "subscriptionStatus"
  )
}
