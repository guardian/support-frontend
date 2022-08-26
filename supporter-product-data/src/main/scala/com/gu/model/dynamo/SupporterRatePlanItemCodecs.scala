package com.gu.model.dynamo

import com.gu.model.ZuoraFieldNames.{
  contractEffectiveDate,
  gifteeIdentityId,
  identityId,
  productRatePlanId,
  productRatePlanName,
  subscriptionName,
  termEndDate,
}
import com.gu.supporterdata.model.SupporterRatePlanItem
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import kantan.csv.HeaderDecoder
import kantan.csv.java8.defaultLocalDateCellDecoder

object SupporterRatePlanItemCodecs {
  implicit val decoder: HeaderDecoder[SupporterRatePlanItem] =
    HeaderDecoder.decoder(
      subscriptionName,
      identityId,
      gifteeIdentityId,
      productRatePlanId,
      productRatePlanName,
      termEndDate,
      contractEffectiveDate,
    )(
      (
          subscriptionName,
          identityId,
          gifteeIdentityId,
          productRatePlanId,
          productRatePlanName,
          termEndDate,
          contractEffectiveDate,
      ) =>
        SupporterRatePlanItem(
          subscriptionName,
          identityId,
          gifteeIdentityId,
          productRatePlanId,
          productRatePlanName,
          termEndDate,
          contractEffectiveDate,
          None,
        ),
    )

  implicit val circeEncoder: Encoder[SupporterRatePlanItem] = deriveEncoder
}
