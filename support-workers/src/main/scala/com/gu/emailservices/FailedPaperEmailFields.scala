package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId

case class FailedPaperEmailFields(email: String, identityUserId: IdentityUserId) extends EmailFields {
  //TODO: update this once there is an email template for paper sign up failures
  override def payload: String = super.payload(email, "digipack-failed")
  override def userId: Either[SfContactId, IdentityUserId] = Right(identityUserId)
}
