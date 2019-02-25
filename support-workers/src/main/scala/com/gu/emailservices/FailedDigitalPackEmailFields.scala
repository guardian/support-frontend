package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId

case class FailedDigitalPackEmailFields(email: String, identityUserId: IdentityUserId) extends EmailFields {
  override def userId: Either[SfContactId, IdentityUserId] = Right(identityUserId)
  override def payload: String = super.payload(email, "digipack-failed")
}
