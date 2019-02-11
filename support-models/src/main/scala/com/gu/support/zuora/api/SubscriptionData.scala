package com.gu.support.zuora.api

import cats.syntax.functor._
import com.gu.support.catalog.{ProductRatePlanChargeId, ProductRatePlanId}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.Codec
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import org.joda.time.{LocalDate, Months}
import com.gu.support.encoding.CustomCodecs.monthDecoder
import com.gu.support.encoding.JsonHelpers._
import com.gu.support.promotions.PromoCode

object RatePlanCharge {
  val fixedPeriod = "FixedPeriod"
  val subscriptionEnd = "SubscriptionEnd"
  val endDateCondition = "EndDateCondition"
  val upToPeriods = "UpToPeriods"

  implicit val discountEncoder: Encoder[DiscountRatePlanCharge] = capitalizingEncoder[DiscountRatePlanCharge]
    .mapJsonObject { jo =>
      jo.toMap.find { case (field, value) => field == upToPeriods && value != Json.Null }
        .map(_ => jo
          .add("UpToPeriodsType", Json.fromString("Months"))
          .add(endDateCondition, Json.fromString(fixedPeriod))
        )
        .getOrElse(jo
          .add(endDateCondition, Json.fromString(subscriptionEnd))
          .remove(upToPeriods)
        )
    }
  implicit val discountDecoder: Decoder[DiscountRatePlanCharge] = decapitalizingDecoder

  implicit val contributionEncoder: Encoder[ContributionRatePlanCharge] = capitalizingEncoder[ContributionRatePlanCharge]
    .mapJsonObject(_
      .add(endDateCondition, Json.fromString(subscriptionEnd)))
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
  upToPeriods: Option[Months]
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

case class RatePlan(productRatePlanId: ProductRatePlanId)

object SubscriptionProductFeature {
  implicit val codec: Codec[SubscriptionProductFeature] = capitalizingCodec
}

case class SubscriptionProductFeature(featureId: String)

object Subscription {
  implicit val decoder: Decoder[Subscription] = decapitalizingDecoder[Subscription].prepare(
    _.withFocus(_.mapObject(_.renameField("PromotionCode__c", "promoCode")))
  )

  implicit val encoder: Encoder[Subscription] = capitalizingEncoder[Subscription].mapJsonObject(_
    .copyField("PromoCode", "PromotionCode__c")
    .renameField("PromoCode", "InitialPromotionCode__c")
  )
}

case class Subscription(
  contractEffectiveDate: LocalDate,
  contractAcceptanceDate: LocalDate,
  termStartDate: LocalDate,
  autoRenew: Boolean = true,
  initialTerm: Int = 12,
  renewalTerm: Int = 12,
  termType: String = "TERMED",
  promoCode: Option[PromoCode] = None
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
