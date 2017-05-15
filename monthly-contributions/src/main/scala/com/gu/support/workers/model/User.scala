package com.gu.support.workers.model

case class User(
  id: String,
  primaryEmailAddress: String,
  firstName: String,
  lastName: String,
  allowMembershipMail: Boolean,
  allowThirdPartyMail: Boolean,
  allowGURelatedMail: Boolean
)
