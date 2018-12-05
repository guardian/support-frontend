package com.gu.support.workers

import com.gu.i18n.Country

case class User(
  id: String,
  primaryEmailAddress: String,
  firstName: String,
  lastName: String,
  country: Country,
  state: Option[String] = None,
  allowMembershipMail: Boolean = false,
  allowThirdPartyMail: Boolean = false,
  allowGURelatedMail: Boolean = false,
  isTestUser: Boolean = false
)
