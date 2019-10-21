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
  channelCodes: Map[Channel, Set[PromoCode]],
  starts: DateTime,
  expires: Option[DateTime],
  discount: Option[DiscountBenefit],
  freeTrial: Option[FreeTrialBenefit],
  incentive: Option[IncentiveBenefit] = None,
  introductoryPrice: Option[IntroductoryPriceBenefit] = None,
  renewalOnly: Boolean = false,
  tracking: Boolean = false,
  landingPage: Option[PromotionCopy] = None
) {
  def promoCodes: Iterable[PromoCode] = channelCodes.values.flatten
}

object Promotion {
  import com.gu.support.encoding.CustomCodecs.{decodeDateTime, encodeDateTime}
  implicit val decoder: Decoder[Promotion] = deriveDecoder[Promotion].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject(_
      .extractBenefits
      .renameField("codes", "channelCodes")
      .checkKeyExists("renewalOnly", Json.fromBoolean(false))
      .checkKeyExists("tracking", Json.fromBoolean(false))
    )
  }

  implicit val encoder: Encoder[Promotion] = deriveEncoder[Promotion].mapJsonObject(_.renameField("channelCodes", "codes"))
}

object Promotions {
  val SixForSixPromotion = Promotion(
    name = "Six For Six",
    description = "Introductory offer",
    appliesTo = AppliesTo(
      Set(
        "2c92a0086619bf8901661ab02752722f",
        "2c92a0fe6619b4b301661aa494392ee2",
        "2c92c0f9660fc4d70166109c01465f10",
        "2c92c0f8660fb5d601661081ea010391",
        "2c92c0f965f2122101660fb81b745a06",
        "2c92c0f965dc30640165f150c0956859"
      ),
      CountryGroup.countries.toSet
    ),
    campaignCode = "Six For Six campaign code",
    channelCodes = Map("dummy channel" -> Set(GuardianWeekly.SixForSixPromoCode)),
    starts = new DateTime(1971, 2, 20, 12, 0, 0, 0),
    expires = None,
    discount = None, freeTrial = None, incentive = None,
    introductoryPrice = Some(IntroductoryPriceBenefit(6, 6, Issue))
  )
}
