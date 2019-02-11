package com.gu.support.zuora.api

import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._

object ContactDetails {
  implicit val codec: Codec[ContactDetails] = capitalizingCodec
}

case class ContactDetails(
  firstName: String,
  lastName: String,
  workEmail: String,
  country: Country,
  address1: Option[String] = None,
  address2: Option[String] = None,
  city: Option[String] = None,
  postalCode: Option[String] = None,
  state: Option[String] = None
)
