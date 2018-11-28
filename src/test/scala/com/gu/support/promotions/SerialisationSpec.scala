package com.gu.support.promotions

import com.gu.support.SerialisationTestHelpers
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.FlatSpec


class SerialisationSpec extends FlatSpec with SerialisationTestHelpers with LazyLogging {

  "Circe" should "be able to decode a discount Promotion" in {
    testDecoding[Promotion[Discount]](Fixtures.discountPromotion)
  }

  "Circe" should "be able to decode a double benefit PromotionType" in {
    testDecoding[DoubleBenefit](Fixtures.doublePromotionType)
  }

  "Circe" should "be able to decode a double benefit Promotion" in {
    testDecoding[Promotion[DoubleBenefit]](Fixtures.doublePromotion)
  }

  "Joda" should "be able to parse date times" in {
    val result = dateFormatter.parseDateTime(Fixtures.startDate)
    result.getYear should be(2018)
  }
}
