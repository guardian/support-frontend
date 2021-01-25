package com.gu.model

case class FieldDefinition(zuoraName: String, dynamoName: String)

object FieldsToExport {
  val identityId = FieldDefinition(
    "Account.IdentityId__c",
    "identityId"
  )
  val ratePlanId = FieldDefinition(
    "RatePlan.Id",
    "ratePlanId"
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
}
