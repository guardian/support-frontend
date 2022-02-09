package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.{Codec, InternationalisationCodecs}

case class AppliesTo(productRatePlanIds: Set[ProductRatePlanId], countries: Set[Country])

object AppliesTo extends InternationalisationCodecs {
  def ukOnly(productRatePlanIds: Set[ProductRatePlanId]): AppliesTo = AppliesTo(productRatePlanIds, Set(Country.UK))

  def all(productRatePlanIds: Set[ProductRatePlanId]): AppliesTo =
    AppliesTo(productRatePlanIds, CountryGroup.countries.toSet)

  implicit val codec: Codec[AppliesTo] = deriveCodec

}
