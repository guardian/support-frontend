package services.pricing

import com.gu.i18n.Currency
import com.gu.support.promotions._
import org.joda.time.DateTime

case class PriceSummary(
    price: BigDecimal,
    savingVsRetail: Option[Float],
    currency: Currency,
    fixedTerm: Boolean,
    promotions: List[PromotionSummary],
)

case class PromotionSummary(
    name: String,
    description: String,
    promoCode: PromoCode,
    discountedPrice: Option[BigDecimal],
    numberOfDiscountedPeriods: Option[Int],
    discount: Option[DiscountBenefit],
    freeTrialBenefit: Option[FreeTrialBenefit],
    incentive: Option[IncentiveBenefit] = None,
    introductoryPrice: Option[IntroductoryPriceBenefit] = None,
    landingPage: Option[PromotionCopy] = None,
    starts: DateTime,
    expires: Option[DateTime],
)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object PromotionSummary {
  import com.gu.support.encoding.CustomCodecs.ISODate._
  implicit val codec: Codec[PromotionSummary] = deriveCodec
}

object PriceSummary {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codec: Codec[PriceSummary] = deriveCodec
}
