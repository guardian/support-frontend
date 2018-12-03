package com.gu.support

import cats.syntax.functor._
import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.encoding.CustomCodecs.{decodeCountry, decodeDateTimeFromString}
import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{ACursor, Decoder, Json}
import org.joda.time.{DateTime, Days, Months}
package object promotions {

  type CampaignCode = String

  type Channel = String

  type PromoCode = String

  case class AppliesTo(productRatePlanIds: Set[ProductRatePlanId], countries: Set[Country])

  object AppliesTo {
    def ukOnly(productRatePlanIds: Set[ProductRatePlanId]) = AppliesTo(productRatePlanIds, Set(Country.UK))

    def all(productRatePlanIds: Set[ProductRatePlanId]) = AppliesTo(productRatePlanIds, CountryGroup.countries.toSet)

    implicit val decoder: Decoder[AppliesTo] = deriveDecoder

  }

  sealed trait Benefit

  case class DiscountBenefit(amount: Double, durationMonths: Option[Months]) extends Benefit

  object DiscountBenefit{
    val jsonName = "percent_discount"
  }

  case class FreeTrialBenefit(duration: Days) extends Benefit

  object FreeTrialBenefit{
    val jsonName = "free_trial"
  }

  case class IncentiveBenefit(redemptionInstructions: String, legalTerms: Option[String], termsAndConditions: Option[String]) extends Benefit

  object IncentiveBenefit {
    val jsonName = "incentive"
  }

  object Benefit {
    import com.gu.support.encoding.CustomCodecs._
    implicit val discountDecoder: Decoder[DiscountBenefit] = deriveDecoder
    implicit val freeTrialDecoder: Decoder[FreeTrialBenefit] = deriveDecoder
    implicit val incentiveDecoder: Decoder[IncentiveBenefit] = deriveDecoder

    implicit val decoder: Decoder[Benefit] = List[Decoder[Benefit]](
      Decoder[DiscountBenefit].widen,
      Decoder[FreeTrialBenefit].widen,
      Decoder[IncentiveBenefit].widen
    ).reduceLeft(_ or _)
  }

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

  sealed trait PromoError {
    def msg: String
  }

  case object InvalidCountry extends PromoError {
    override val msg = "The promo code you supplied is not applicable in this country"
  }

  case object InvalidProductRatePlan extends PromoError {
    override val msg = "The promo code you supplied is not applicable for this product"
  }

  case object NotApplicable extends PromoError {
    override  val msg = "This promotion is not applicable"
  }

  case object NoSuchCode extends PromoError {
    override  val msg = "Unknown or expired promo code"
  }

  case object ExpiredPromotion extends PromoError {
    override val msg = "The promo code you supplied has expired"
  }

  case object PromotionNotActiveYet extends PromoError {
    override val msg = "The promo code you supplied is not active yet"
  }

}
