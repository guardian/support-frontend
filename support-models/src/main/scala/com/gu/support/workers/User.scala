package com.gu.support.workers

import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

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
  isTestUser: Boolean = false,
  telphoneNumber: Option[String] = None
)

object User {
  import com.gu.support.encoding.CustomCodecs._
  implicit val decoder: Codec[User] = deriveCodec
}
