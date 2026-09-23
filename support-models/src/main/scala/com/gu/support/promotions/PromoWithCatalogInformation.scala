package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.encoding.InternationalisationCodecs
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import org.joda.time.DateTime

case class PromoDiscount(amount: Double, durationMonths: Int)

case class PromoLandingPage(title: Option[String], description: Option[String], roundelHtml: Option[String])

/** The catalog rate plan a promotion applies to, left as plain strings rather than being strongly typed against the
  * product catalog because we don't have those types in Scala
  */
case class CatalogRatePlan(productKey: String, productRatePlanKey: String)

/** Mirrors the shared TS `AppliesToCatalogInformation` type (@modules/promotions/v2/schema). */
case class AppliesToCatalogInformation(
    productRatePlanIds: Set[ProductRatePlanId],
    countries: Set[Country],
    catalogRatePlans: List[CatalogRatePlan],
)

/** Mirrors the shared TS `PromoWithCatalogInformation` type (@modules/promotions/v2/schema)
  *
  * This is deliberately a separate model from the [[Promotion]] domain object (which has a different shape, used by the
  * legacy productPrices/PromotionValidator mechanism, decoded from a different Zuora-catalog-embedded JSON format)
  */
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
