package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.encoding.InternationalisationCodecs
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class AppliesTo(productRatePlanIds: Set[ProductRatePlanId], countries: Set[Country])

object AppliesTo extends InternationalisationCodecs {
  def ukOnly(productRatePlanIds: Set[ProductRatePlanId]) = AppliesTo(productRatePlanIds, Set(Country.UK))

  def all(productRatePlanIds: Set[ProductRatePlanId]) = AppliesTo(productRatePlanIds, CountryGroup.countries.toSet)

  implicit val decoder: Decoder[AppliesTo] = deriveDecoder

}
