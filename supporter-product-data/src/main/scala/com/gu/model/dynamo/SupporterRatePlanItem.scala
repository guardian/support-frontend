package com.gu.model.dynamo

import com.gu.model.FieldsToExport._
import kantan.csv.HeaderDecoder
import kantan.csv.java8.defaultLocalDateCellDecoder

import java.time.LocalDate

case class SupporterRatePlanItem(
  identityId: String, //Unique identifier for user
  gifteeIdentityId: Option[String], //Unique identifier for user if this is a DS gift subscription
  ratePlanId: String, //Unique identifier for this product purchase for this user
  productRatePlanId: String, //Unique identifier for the product in this rate plan
  productRatePlanName: String, //Name of the product in this rate plan
  termEndDate: LocalDate, //Date that this subscription term ends
  contractEffectiveDate: LocalDate //Date that this subscription started
)

object SupporterRatePlanItem {
  implicit val decoder: HeaderDecoder[SupporterRatePlanItem] =
    HeaderDecoder.decoder(
      identityId.zuoraName,
      gifteeIdentityId.zuoraName,
      ratePlanId.zuoraName,
      productRatePlanId.zuoraName,
      productRatePlanName.zuoraName,
      termEndDate.zuoraName,
      contractEffectiveDate.zuoraName
    )(SupporterRatePlanItem.apply)
}

