package com.gu.model.dynamo

import com.gu.model.FieldsToExport._
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import kantan.csv.HeaderDecoder
import kantan.csv.java8.defaultLocalDateCellDecoder

import java.time.LocalDate

case class SupporterRatePlanItem(
  identityId: String, //Unique identifier for user
  subscriptionName: String, //Unique identifier for the subscription
  gifteeIdentityId: Option[String], //Unique identifier for user if this is a DS gift subscription
  productRatePlanId: String, //Unique identifier for the product in this rate plan
  productRatePlanName: String, //Name of the product in this rate plan
  termEndDate: LocalDate, //Date that this subscription term ends
  contractEffectiveDate: LocalDate //Date that this subscription started
)

object SupporterRatePlanItem {
  implicit val decoder: HeaderDecoder[SupporterRatePlanItem] =
    HeaderDecoder.decoder(
      subscriptionName.zuoraName,
      identityId.zuoraName,
      gifteeIdentityId.zuoraName,
      productRatePlanId.zuoraName,
      productRatePlanName.zuoraName,
      termEndDate.zuoraName,
      contractEffectiveDate.zuoraName
    )(SupporterRatePlanItem.apply)

  implicit val circeEncoder: Encoder[SupporterRatePlanItem] = deriveEncoder
}

