package com.gu.support.promotions

import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{ACursor, Decoder, Json}
import org.joda.time.DateTime

case class Promotion(
  name: String,
  description: String,
  appliesTo: AppliesTo,
  campaignCode: CampaignCode,
  channelCodes: Map[Channel, Set[PromoCode]],
  starts: DateTime,
  expires: Option[DateTime],
  discount: Option[DiscountBenefit],
  freeTrial: Option[FreeTrialBenefit],
  incentive: Option[IncentiveBenefit] = None,
  renewalOnly: Boolean = false,
  tracking: Boolean = false
) {
  def promoCodes: Iterable[PromoCode] = channelCodes.values.flatten
}

object Promotion {
  import com.gu.support.encoding.CustomCodecs.decodeDateTimeFromString
  implicit val decoder: Decoder[Promotion] = deriveDecoder[Promotion].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject(_
      .extractBenefits
      .renameField("codes", "channelCodes")
      .checkKeyExists("renewalOnly", Json.fromBoolean(false))
      .checkKeyExists("tracking", Json.fromBoolean(false))
    )
  }
}
