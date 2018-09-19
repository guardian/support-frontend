package com.gu.emailservices

case class FailedContributionEmailFields(email: String, sfContactId: Option[String], identityId: Option[String]) extends EmailFields {
  override def payload: String = super.payload(email, "contribution-failed")
}
