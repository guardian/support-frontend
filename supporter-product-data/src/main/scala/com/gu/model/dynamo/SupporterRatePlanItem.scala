package com.gu.model.dynamo

import com.gu.model.FieldsToExport._
import kantan.csv.HeaderDecoder

case class SupporterRatePlanItem(
  identityId: String, //Unique identifier for user
  ratePlanId: String, //Unique identifier for this product purchase for this user
  productRatePlanId: String, //Unique identifier for the product in this rate plan
  ratePlanName: String, //Name of the product in this rate plan
  termEndDate: String //Date that this subscription term ends
)

object SupporterRatePlanItem {
  implicit val decoder: HeaderDecoder[SupporterRatePlanItem] =
    HeaderDecoder.decoder(
      identityId.zuoraName,
      ratePlanId.zuoraName,
      productRatePlanId.zuoraName,
      ratePlanName.zuoraName,
      termEndDate.zuoraName
    )(SupporterRatePlanItem.apply)
}

