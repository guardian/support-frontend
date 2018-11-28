package com.gu.support

import cats.syntax.functor._
import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{ACursor, Decoder}
import org.joda.time.format.DateTimeFormat
import org.joda.time.{DateTime, Days}

package object promotions {
  type CampaignCode = String

  type Channel = String

  type PromoCode = String

  type AnyPromotion = Promotion[PromotionType]

  case class AppliesTo(productRatePlanIds: Set[ProductRatePlanId], countries: Set[Country])

  object AppliesTo {
    def ukOnly(productRatePlanIds: Set[ProductRatePlanId]) = AppliesTo(productRatePlanIds, Set(Country.UK))

    def all(productRatePlanIds: Set[ProductRatePlanId]) = AppliesTo(productRatePlanIds, CountryGroup.countries.toSet)

    implicit val decoder: Decoder[AppliesTo] = deriveDecoder

  }

  sealed trait PromotionType {
    override def toString = getClass.getSimpleName

    val name: String
  }

  case class Discount(durationMonths: Option[Int], amount: Double) extends PromotionType {
    val name = "Discount"
  }

  case class FreeTrial(duration: Days) extends PromotionType {
    val name = "FreeTrial"
  }

  case object Renewal extends PromotionType {
    val name = "Renewal"
  }

  @Deprecated
  case object Tracking extends PromotionType {
    val name = "Tracking"
  }

  case class DoubleBenefit(a: PromotionType, b: PromotionType) extends PromotionType {
    val name = "Double"
  }

  object PromotionType {
    implicit val discountDecoder: Decoder[Discount] = deriveDecoder
    implicit val freeTrialDecoder: Decoder[FreeTrial] = deriveDecoder
    implicit val renewalDecoder: Decoder[Renewal.type] = deriveDecoder
    implicit val trackingDecoder: Decoder[Tracking.type] = deriveDecoder
    implicit val doubleDecoder: Decoder[DoubleBenefit] = deriveDecoder

    implicit val decodePromotionType: Decoder[PromotionType] =
      List[Decoder[PromotionType]](
        Decoder[Discount].widen,
        Decoder[FreeTrial].widen,
        Decoder[DoubleBenefit].widen,
        Decoder[Renewal.type].widen,
        Decoder[Tracking.type].widen
      ).reduceLeft(_ or _)
  }

  case class Promotion[+Type <: PromotionType](
    name: String,
    description: String,
    appliesTo: AppliesTo,
    campaignCode: CampaignCode,
    channelCodes: Map[Channel, Set[PromoCode]],
    starts: DateTime,
    expires: Option[DateTime],
    promotionType: Type) {
    def promoCodes: Iterable[PromoCode] = channelCodes.values.flatten
  }

  object Promotion{

    private def mapFields(c: ACursor) = c.withFocus {
        _.mapObject { x =>
          val value = x("codes") //Change the incoming codes element name to channelCodes to match the Promotion case class
          value.map(x.add("channelCodes", _)).getOrElse(x)
        }
      }


    implicit val discountDecoder: Decoder[Promotion[Discount]] = deriveDecoder[Promotion[Discount]].prepare(mapFields)
    implicit val doubleDecoder: Decoder[Promotion[DoubleBenefit]] = deriveDecoder[Promotion[DoubleBenefit]].prepare(mapFields)
    implicit val freeTrialDecoder: Decoder[Promotion[FreeTrial]] = deriveDecoder[Promotion[FreeTrial]].prepare(mapFields)
    implicit val renewalDecoder: Decoder[Promotion[Renewal.type]] = deriveDecoder[Promotion[Renewal.type]].prepare(mapFields)
    implicit val trackingDecoder: Decoder[Promotion[Tracking.type]] = deriveDecoder[Promotion[Tracking.type]].prepare(mapFields)

    implicit val promotionDecoder: Decoder[Promotion[PromotionType]] = List[Decoder[Promotion[PromotionType]]](
      Decoder[Promotion[Discount]].widen,
      Decoder[Promotion[FreeTrial]].widen,
      Decoder[Promotion[DoubleBenefit]].widen,
      Decoder[Promotion[Renewal.type]].widen,
      Decoder[Promotion[Tracking.type]].widen
    ).reduceLeft(_ or _)

  }

  implicit val countryDecoder: Decoder[Country] = Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }
  implicit val dayDecoder: Decoder[Days] = Decoder.decodeInt.map(Days.days)
  val dateFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
  implicit val dateTimeDecoder: Decoder[DateTime] = Decoder.decodeString.map(dateFormatter.parseDateTime)

}
