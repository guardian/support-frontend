package com.gu.support.pricing

import com.gu.i18n.Currency
import com.gu.support.promotions._


case class PriceSummary(
  price: BigDecimal,
  currency: Currency,
  promotion: Option[PromotionSummary]
)

case class PromotionSummary(
  name: String,
  description: String,
  promoCode: PromoCode,
  discountedPrice: Option[BigDecimal],
  discount: Option[DiscountBenefit],
  freeTrialBenefit: Option[FreeTrialBenefit],
  incentive: Option[IncentiveBenefit] = None
)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object PromotionSummary {
  implicit val codec: Codec[PromotionSummary] = deriveCodec
}

object PriceSummary {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codec: Codec[PriceSummary] = deriveCodec

  implicit class ext(list: List[PriceSummary]){
    def apply(currency: Currency) = list.find(_.currency == currency)
  }
}
