package com.gu.support.zuora.api

import cats.syntax.functor._
import com.gu.support.catalog.{ProductRatePlanChargeId, ProductRatePlanId}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{monthDecoder, _}
import com.gu.support.encoding.JsonHelpers._
import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.redemptions.RawRedemptionCode
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json, parser}
import org.joda.time.{LocalDate, Months}

object RatePlanCharge {
  val fixedPeriod = "FixedPeriod"
  val subscriptionEnd = "SubscriptionEnd"
  val endDateCondition = "EndDateCondition"
  val upToPeriods = "UpToPeriods"
  val triggerEvent = "TriggerEvent"
  val specificEvent = "SpecificDate"

  implicit val discountEncoder: Encoder[DiscountRatePlanCharge] = capitalizingEncoder[DiscountRatePlanCharge]
    .mapJsonObject { jo =>
      jo.toMap
        .find { case (field, value) => field == upToPeriods && value != Json.Null }
        .map(_ =>
          jo
            .add("UpToPeriodsType", Json.fromString("Months"))
            .add(endDateCondition, Json.fromString(fixedPeriod)),
        )
        .getOrElse(
          jo
            .add(endDateCondition, Json.fromString(subscriptionEnd))
            .remove(upToPeriods),
        )
    }
  implicit val discountDecoder: Decoder[DiscountRatePlanCharge] = decapitalizingDecoder

  implicit val contributionEncoder: Encoder[RatePlanChargeOverride] =
    capitalizingEncoder[RatePlanChargeOverride]
      .mapJsonObject(_.add(endDateCondition, Json.fromString(subscriptionEnd)))
  implicit val contributionDecoder: Decoder[RatePlanChargeOverride] = decapitalizingDecoder

  implicit val introductoryPriceEncoder: Encoder[IntroductoryPriceRatePlanCharge] =
    capitalizingEncoder[IntroductoryPriceRatePlanCharge]
      .mapJsonObject(_.add(triggerEvent, Json.fromString(specificEvent)))
  implicit val introductoryPriceDecoder: Decoder[IntroductoryPriceRatePlanCharge] = decapitalizingDecoder

  implicit val encodeRatePlanCharge: Encoder[RatePlanCharge] = Encoder.instance {
    case f: DiscountRatePlanCharge => f.asJson
    case s: RatePlanChargeOverride => s.asJson
    case i: IntroductoryPriceRatePlanCharge => i.asJson
  }

  implicit val decodeRatePlanCharge: Decoder[RatePlanCharge] =
    List[Decoder[RatePlanCharge]](
      Decoder[DiscountRatePlanCharge].widen,
      Decoder[RatePlanChargeOverride].widen,
      Decoder[IntroductoryPriceRatePlanCharge].widen,
    ).reduceLeft(_ or _)
}

sealed trait RatePlanCharge {
  def productRatePlanChargeId: ProductRatePlanChargeId
}

case class DiscountRatePlanCharge(
    productRatePlanChargeId: ProductRatePlanChargeId,
    discountPercentage: Double,
    upToPeriods: Option[Months],
) extends RatePlanCharge

case class RatePlanChargeOverride(
    productRatePlanChargeId: ProductRatePlanChargeId,
    price: BigDecimal,
) extends RatePlanCharge

case class IntroductoryPriceRatePlanCharge(
    productRatePlanChargeId: ProductRatePlanChargeId,
    price: BigDecimal,
    triggerDate: LocalDate,
) extends RatePlanCharge

sealed trait PeriodType

case object Day extends PeriodType

case object Month extends PeriodType

case object Quarter extends PeriodType

case object Annual extends PeriodType

object PeriodType {
  implicit val decodePeriod: Decoder[PeriodType] = Decoder.decodeString.map(code => fromString(code))
  implicit val encodePeriod: Encoder[PeriodType] = Encoder.encodeString.contramap[PeriodType](_.toString)

  private def fromString(s: String) = {
    s.toLowerCase match {
      case "day" => Day
      case "month" => Month
      case "quarter" => Quarter
      case "annual" => Annual
    }
  }
}

object ReaderType {

  case object Direct extends ReaderType {
    val value = "Direct"
  }
  case object Gift extends ReaderType {
    val value = "Gift"
  }
  case object Corporate extends ReaderType {
    val value = "Corporate"
  }
  case object Agent extends ReaderType {
    val value = "Agent"
  }
  case object Unknown extends ReaderType {
    val value = "Unknown"
  }

  def fromString(s: String): ReaderType =
    s match {
      case Gift.value => Gift
      case Agent.value => Agent
      case Corporate.value => Corporate
      case Direct.value => Direct
      case _ => Unknown
    }

  implicit val decode: Decoder[ReaderType] = Decoder.decodeString.map(code => fromString(code))
  implicit val encod: Encoder[ReaderType] = Encoder.encodeString.contramap[ReaderType](_.toString)

}
sealed trait ReaderType {
  def value: String
}

object AcquisitionSource {

  case object CSR extends AcquisitionSource {
    val value = "CSR"
  }

  case object Unknown extends AcquisitionSource {
    val value = "Unknown"
  }

  def fromString(s: String): AcquisitionSource =
    s match {
      case CSR.value => CSR
      case _ => Unknown
    }

  implicit val decode: Decoder[AcquisitionSource] = Decoder.decodeString.map(code => fromString(code))
  implicit val encod: Encoder[AcquisitionSource] = Encoder.encodeString.contramap[AcquisitionSource](_.toString)

}
sealed trait AcquisitionSource {
  def value: String
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

  implicit val encoder: Encoder[Subscription] = capitalizingEncoder[Subscription].mapJsonObject(
    _.copyField("PromoCode", "PromotionCode__c")
      .renameField("PromoCode", "InitialPromotionCode__c")
      .renameField("ReaderType", "ReaderType__c")
      .renameField("RedemptionCode", "RedemptionCode__c")
      .renameField("CorporateAccountId", "CorporateAccountId__c")
      .renameField("CreatedRequestId", "CreatedRequestId__c")
      .renameField("GiftNotificationEmailDate", "GiftNotificationEmailDate__c")
      .renameField("AcquisitionSource", "AcquisitionSource__c")
      .renameField("CreatedByCsr", "CreatedByCSR__c")
      .renameField("AcquisitionCase", "AcquisitionCase__c"),
  )
}

case class Subscription(
    contractEffectiveDate: LocalDate,
    contractAcceptanceDate: LocalDate,
    termStartDate: LocalDate,
    createdRequestId: String,
    autoRenew: Boolean = true,
    initialTermPeriodType: PeriodType = Month,
    initialTerm: Int = 12,
    renewalTerm: Int = 12,
    termType: String = "TERMED",
    readerType: ReaderType = ReaderType.Direct,
    promoCode: Option[PromoCode] = None,
    redemptionCode: Option[RawRedemptionCode] = None,
    corporateAccountId: Option[String] = None,
    giftNotificationEmailDate: Option[LocalDate] = None,
    acquisitionSource: Option[AcquisitionSource] = None,
    createdByCsr: Option[String] = None,
    acquisitionCase: Option[String] = None,
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
    subscriptionProductFeatureList: List[SubscriptionProductFeature],
)

object SubscriptionData {
  implicit val encoder: Encoder[SubscriptionData] = capitalizingEncoder
}

case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)
