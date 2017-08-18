package com.gu.support.workers.model

import com.gu.i18n.Country

case class User(
  id: String,
  primaryEmailAddress: String,
  firstName: String,
  lastName: String,
  country: Country,
  state: Option[String],
  allowMembershipMail: Boolean,
  allowThirdPartyMail: Boolean,
  allowGURelatedMail: Boolean,
  isTestUser: Boolean
)
