package com.gu.zuora.model

import com.gu.i18n.Country
import com.gu.zuora.encoding.CapitalizationEncoder._
import io.circe.{Decoder, Encoder}
import com.gu.zuora.encoding.CustomCodecs._

object ContactDetails {
  implicit val encoder: Encoder[ContactDetails] = capitalizingEncoder
  implicit val decoder: Decoder[ContactDetails] = decapitalizingDecoder
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