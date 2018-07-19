package com.gu.emailservices

class FailedContributionEmailFields(email: String) extends EmailFields {
  override def payload = super.payload(email, "contribution-failed")
}
