package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId

case class FailedGuardianWeeklyEmailFields(email: String, identityUserId: IdentityUserId) extends EmailFields {
  override def payload: String = super.payload(email, "guardian-weekly-failed")
  override def userId: Either[SfContactId, IdentityUserId] = Right(identityUserId)
}
