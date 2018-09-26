package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId

case class FailedContributionEmailFields(email: String, identityUserId: IdentityUserId) extends EmailFields {
  override def payload: String = super.payload(email, "contribution-failed")
  override def userId: Either[SfContactId, IdentityUserId] = Right(identityUserId)
}
