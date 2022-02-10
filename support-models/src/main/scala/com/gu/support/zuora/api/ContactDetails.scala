package com.gu.support.zuora.api

import com.gu.i18n.Country
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import io.circe.{Decoder, Encoder}

object ContactDetails {
  private val customFieldName = "SpecialDeliveryInstructions__c"
  private val classMemberName = "DeliveryInstructions"
  implicit val decoder: Decoder[ContactDetails] = decapitalizingDecoder[ContactDetails].prepare(
    _.withFocus(_.mapObject(_.renameField(customFieldName, classMemberName))),
  )

  implicit val encoder: Encoder[ContactDetails] = capitalizingEncoder[ContactDetails].mapJsonObject(
    _.renameField(classMemberName, customFieldName),
  )
}

case class ContactDetails(
    firstName: String,
    lastName: String,
    workEmail: Option[String],
    country: Country,
    address1: Option[String] = None,
    address2: Option[String] = None,
    city: Option[String] = None,
    postalCode: Option[String] = None,
    state: Option[String] = None,
    deliveryInstructions: Option[String] = None,
)
