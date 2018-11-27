package com.gu.support.promotions

import com.gu.support.catalog.ProductRatePlanId
import org.joda.time.DateTime

/**
  * Promotions are quite laborious to construct
  * So these are helper methods for unit tests
  */
object Fixtures {

  def promoFor[T<: PromotionType](code: PromoCode, promotionType: T, ids: ProductRatePlanId*): Promotion[T] = Promotion(
    name = "Test promotion",
    description = s"$code description",
    appliesTo = AppliesTo.ukOnly(ids.toSet),
    campaignCode = "C",
    channelCodes = Map("testChannel" -> Set(code)),
    starts = DateTime.now().minusDays(1),
    expires = Some(DateTime.now().plusDays(1)),
    promotionType = promotionType
  )
}

