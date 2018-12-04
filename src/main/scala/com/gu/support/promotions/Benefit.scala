package com.gu.support.promotions

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import org.joda.time.{Days, Months}
import cats.syntax.functor._

sealed trait Benefit

case class DiscountBenefit(amount: Double, durationMonths: Option[Months]) extends Benefit

object DiscountBenefit{
  val jsonName = "percent_discount"
}

case class FreeTrialBenefit(duration: Days) extends Benefit

object FreeTrialBenefit{
  val jsonName = "free_trial"
}

case class IncentiveBenefit(redemptionInstructions: String, legalTerms: Option[String], termsAndConditions: Option[String]) extends Benefit

object IncentiveBenefit {
  val jsonName = "incentive"
}

object Benefit {
  import com.gu.support.encoding.CustomCodecs._
  implicit val discountDecoder: Decoder[DiscountBenefit] = deriveDecoder
  implicit val freeTrialDecoder: Decoder[FreeTrialBenefit] = deriveDecoder
  implicit val incentiveDecoder: Decoder[IncentiveBenefit] = deriveDecoder

  implicit val decoder: Decoder[Benefit] = List[Decoder[Benefit]](
    Decoder[DiscountBenefit].widen,
    Decoder[FreeTrialBenefit].widen,
    Decoder[IncentiveBenefit].widen
  ).reduceLeft(_ or _)
}
