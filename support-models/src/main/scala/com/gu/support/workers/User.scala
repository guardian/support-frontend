package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class User(
    id: String,
    primaryEmailAddress: String,
    title: Option[Title],
    firstName: String,
    lastName: String,
    billingAddress: Address,
    deliveryAddress: Option[Address] = None, // TODO should later be moved out of User and into the relevant case class
    telephoneNumber: Option[String] = None,
    allowMembershipMail: Boolean = false,
    allowThirdPartyMail: Boolean = false,
    allowGURelatedMail: Boolean = false,
    isTestUser: Boolean = false,
    deliveryInstructions: Option[String] =
      None, // TODO should later be moved out of User and into the relevant case class
)

object User {
  import com.gu.support.encoding.CustomCodecs._
  implicit val decoder: Codec[User] = deriveCodec
}
