package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId

case class FailedGuardianWeeklyEmailFields(email: String, identityUserId: IdentityUserId) extends EmailFields {
  //TODO: update this once there is an email template for paper sign up failures
  override def payload: String = super.payload(email, "guardian-weekly-failed")
  override def userId: Either[SfContactId, IdentityUserId] = Right(identityUserId)
}
