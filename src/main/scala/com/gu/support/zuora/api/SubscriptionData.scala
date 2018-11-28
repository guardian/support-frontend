package com.gu.support.zuora.api

import cats.syntax.functor._
import com.gu.support.catalog.ProductRatePlanChargeId
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.Codec
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import org.joda.time.LocalDate

object RatePlanCharge {
  implicit val discountEncoder: Encoder[DiscountRatePlanCharge] = capitalizingEncoder[DiscountRatePlanCharge]
    .mapJsonObject(_
      .add("UpToPeriodsType", Json.fromString("Months"))
      .add("EndDateCondition", Json.fromString("FixedPeriod")))
  implicit val discountDecoder: Decoder[DiscountRatePlanCharge] = decapitalizingDecoder

  implicit val contributionEncoder: Encoder[ContributionRatePlanCharge] = capitalizingEncoder[ContributionRatePlanCharge]
    .mapJsonObject(_
      .add("EndDateCondition", Json.fromString("SubscriptionEnd")))
  implicit val contributionDecoder: Decoder[ContributionRatePlanCharge] = decapitalizingDecoder

  implicit val encodeRatePlanCharge: Encoder[RatePlanCharge] = Encoder.instance {
    case f: DiscountRatePlanCharge => f.asJson
    case s: ContributionRatePlanCharge => s.asJson
  }

  implicit val decodeRatePlanCharge: Decoder[RatePlanCharge] =
    List[Decoder[RatePlanCharge]](
      Decoder[DiscountRatePlanCharge].widen,
      Decoder[ContributionRatePlanCharge].widen
    ).reduceLeft(_ or _)
}

sealed trait RatePlanCharge {
  def productRatePlanChargeId: ProductRatePlanChargeId
}

case class DiscountRatePlanCharge(
  productRatePlanChargeId: ProductRatePlanChargeId,
  discountPercentage: Double,
  upToPeriods: Int
) extends RatePlanCharge

case class ContributionRatePlanCharge(
  productRatePlanChargeId: ProductRatePlanChargeId,
  price: BigDecimal
) extends RatePlanCharge

sealed trait PeriodType

case object Month extends PeriodType

case object Quarter extends PeriodType

case object Annual extends PeriodType

object PeriodType {
  implicit val decodePeriod: Decoder[PeriodType] = Decoder.decodeString.map(code => fromString(code))
  implicit val encodePeriod: Encoder[PeriodType] = Encoder.encodeString.contramap[PeriodType](_.toString)

  private def fromString(s: String) = {
    s.toLowerCase match {
      case "month" => Month
      case "quarter" => Quarter
      case "annual" => Annual
    }
  }
}

object RatePlan {
  implicit val codec: Codec[RatePlan] = capitalizingCodec
}

case class RatePlan(productRatePlanId: String)

object SubscriptionProductFeature {
  implicit val codec: Codec[SubscriptionProductFeature] = capitalizingCodec
}

case class SubscriptionProductFeature(featureId: String)

object Subscription {
  implicit val codec: Codec[Subscription] = capitalizingCodec
}

case class Subscription(
  contractEffectiveDate: LocalDate,
  contractAcceptanceDate: LocalDate,
  termStartDate: LocalDate,
  autoRenew: Boolean = true,
  initialTerm: Int = 12,
  renewalTerm: Int = 12,
  termType: String = "TERMED"
)

object RatePlanChargeData {
  implicit val codec: Codec[RatePlanChargeData] = capitalizingCodec
}

case class RatePlanChargeData(ratePlanCharge: RatePlanCharge)

object RatePlanData {
  implicit val codec: Codec[RatePlanData] = capitalizingCodec
}

case class RatePlanData(
  ratePlan: RatePlan,
  ratePlanChargeData: List[RatePlanChargeData],
  subscriptionProductFeatureList: List[SubscriptionProductFeature]
)

object SubscriptionData {
  implicit val codec: Codec[SubscriptionData] = capitalizingCodec
}

case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)
