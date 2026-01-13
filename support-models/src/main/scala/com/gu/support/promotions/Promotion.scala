package com.gu.support.promotions

import com.gu.i18n.CountryGroup
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{ACursor, Decoder, Encoder, Json}
import org.joda.time.DateTime

case class Promotion(
    name: String,
    description: String,
    appliesTo: AppliesTo,
    campaignCode: CampaignCode,
    promoCode: PromoCode,
    starts: DateTime,
    expires: Option[DateTime],
    discount: Option[DiscountBenefit],
    freeTrial: Option[FreeTrialBenefit],
    incentive: Option[IncentiveBenefit] = None,
    renewalOnly: Boolean = false,
    tracking: Boolean = false,
    landingPage: Option[PromotionCopy] = None,
)

object Promotion {
  import com.gu.support.encoding.CustomCodecs.ISODate.decodeDateTime
  implicit val decoder: Decoder[Promotion] = deriveDecoder[Promotion].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject(
      _.extractBenefits
        .renameField("startTimestamp", "starts")
        .renameField("endTimestamp", "expires")
        .checkKeyExists("renewalOnly", Json.fromBoolean(false))
        .checkKeyExists("tracking", Json.fromBoolean(false)),
    )
  }

}
