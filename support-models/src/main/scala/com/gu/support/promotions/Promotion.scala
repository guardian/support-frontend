package com.gu.support.promotions

import com.gu.i18n.CountryGroup
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{ACursor, Decoder, Encoder, Json}
import org.joda.time.DateTime
import com.gu.support.encoding.CustomCodecs.MillisDate.encodeDateTime

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
    isIntroductoryPricing: Option[Boolean] = None,
)

object Promotion {
  import com.gu.support.encoding.CustomCodecs.ISODate.decodeDateTime
  implicit val decoder: Decoder[Promotion] = deriveDecoder[Promotion].prepare(mapFields)
  implicit val encoder: Encoder[Promotion] = deriveEncoder

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject(
      _.extractBenefits
        .renameField("startTimestamp", "starts")
        .renameField("endTimestamp", "expires")
        .checkKeyExists("renewalOnly", Json.fromBoolean(false))
        .checkKeyExists("tracking", Json.fromBoolean(false))
        // description is optional on promotions-api, unlike the legacy Zuora-embedded promotions this model was
        // originally shaped for - default it to empty rather than failing to decode.
        .checkKeyExists("description", Json.fromString("")),
    )
  }

}
