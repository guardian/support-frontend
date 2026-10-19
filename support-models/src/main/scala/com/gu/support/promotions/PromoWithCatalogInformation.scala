package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.encoding.InternationalisationCodecs
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import org.joda.time.DateTime

case class PromoDiscount(amount: Double, durationMonths: Int)

case class PromoLandingPage(title: Option[String], description: Option[String], roundelHtml: Option[String])

// Product key and product rate plan key are left as plain strings because we don't have those types in Scala
case class CatalogRatePlan(productKey: String, productRatePlanKey: String) {
  def isGift: Boolean =
    CatalogRatePlan.guardianWeeklyProductKeys.contains(productKey) &&
      CatalogRatePlan.guardianWeeklyGiftRatePlanKeys.contains(productRatePlanKey)
}

object CatalogRatePlan {
  val guardianWeeklyProductKeys: Set[String] = Set("GuardianWeeklyDomestic", "GuardianWeeklyRestOfWorld")
  val paperProductKeys: Set[String] = Set("HomeDelivery", "NationalDelivery", "SubscriptionCard")
  private val guardianWeeklyGiftRatePlanKeys = Set("OneYearGift", "ThreeMonthGift")

  def guardianWeeklyProductKey(countryGroup: CountryGroup): String =
    if (countryGroup == CountryGroup.RestOfTheWorld) "GuardianWeeklyRestOfWorld" else "GuardianWeeklyDomestic"
}
case class AppliesToCatalogInformation(
    productRatePlanIds: Set[ProductRatePlanId],
    countries: Set[Country],
    catalogRatePlans: List[CatalogRatePlan],
)
case class PromoWithCatalogInformation(
    promoCode: PromoCode,
    name: String,
    campaignCode: CampaignCode,
    appliesTo: AppliesToCatalogInformation,
    startTimestamp: DateTime,
    endTimestamp: Option[DateTime],
    discount: Option[PromoDiscount],
    description: Option[String],
    landingPage: Option[PromoLandingPage],
    isIntroductoryPricing: Option[Boolean],
)

object PromoWithCatalogInformation extends InternationalisationCodecs {
  implicit val discountDecoder: Decoder[PromoDiscount] = deriveDecoder
  implicit val landingPageDecoder: Decoder[PromoLandingPage] = deriveDecoder
  implicit val catalogRatePlanDecoder: Decoder[CatalogRatePlan] = deriveDecoder
  implicit val appliesToCatalogInformationDecoder: Decoder[AppliesToCatalogInformation] = deriveDecoder
  implicit val decoder: Decoder[PromoWithCatalogInformation] = {
    import com.gu.support.encoding.CustomCodecs.ISODate.decodeDateTime
    deriveDecoder
  }

  implicit val discountEncoder: Encoder[PromoDiscount] = deriveEncoder
  implicit val landingPageEncoder: Encoder[PromoLandingPage] = deriveEncoder
  implicit val catalogRatePlanEncoder: Encoder[CatalogRatePlan] = deriveEncoder
  implicit val appliesToCatalogInformationEncoder: Encoder[AppliesToCatalogInformation] = deriveEncoder
  implicit val encoder: Encoder[PromoWithCatalogInformation] = {
    import com.gu.support.encoding.CustomCodecs.ISODate.encodeDateTime
    deriveEncoder
  }
}
