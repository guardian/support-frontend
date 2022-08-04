package com.gu.emailservices

object FailedEmailFields {

  def contribution(email: String, identityUserId: IdentityUserId): EmailFields =
    failedEmailFields("contribution-failed", email, identityUserId)

  def supporterPlus(email: String, identityUserId: IdentityUserId): EmailFields =
    failedEmailFields("supporter-plus-failed", email, identityUserId) // TODO: this email doesn't exist!

  def digitalPack(email: String, identityUserId: IdentityUserId): EmailFields =
    failedEmailFields("digipack-failed", email, identityUserId)

  def guardianWeekly(email: String, identityUserId: IdentityUserId): EmailFields =
    failedEmailFields("guardian-weekly-failed", email, identityUserId)

  def paper(email: String, identityUserId: IdentityUserId): EmailFields =
    failedEmailFields("paper-failed", email, identityUserId)

  private def failedEmailFields(dataExtensionName: String, email: String, identityUserId: IdentityUserId): EmailFields =
    EmailFields(Nil, Right(identityUserId), email, dataExtensionName, None, None)

}
