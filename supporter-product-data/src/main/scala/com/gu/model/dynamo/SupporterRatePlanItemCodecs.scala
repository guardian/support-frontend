package com.gu.model.dynamo

import com.gu.model.ZuoraFieldNames._
import com.gu.supporterdata.model.{ContributionAmount, SupporterRatePlanItem}
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
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

  implicit val codec: Codec[SupporterRatePlanItem] = deriveCodec
  implicit val contributionCodec: Codec[ContributionAmount] = deriveCodec
}
