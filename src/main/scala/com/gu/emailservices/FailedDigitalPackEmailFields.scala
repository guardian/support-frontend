package com.gu.emailservices

case class FailedDigitalPackEmailFields(email: String, sfContactId: Option[String], identityId: Option[String]) extends EmailFields {
  override def payload: String = super.payload(email, "digipack-failed")
}
