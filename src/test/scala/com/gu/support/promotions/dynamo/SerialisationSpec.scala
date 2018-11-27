package com.gu.support.promotions.dynamo

import com.gu.support.promotions.{Promotion, PromotionType}
import com.typesafe.scalalogging.LazyLogging
import io.circe.Decoder
import io.circe.parser.decode
import org.scalatest.{FlatSpec, Matchers}
import com.gu.support.promotions.dateFormatter

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging {

  "Circe" should "be able to decode a Promotion" in {
    testDecoding[Promotion[PromotionType]](Fixtures.promotion)
  }

  "Joda" should "be able to parse date times" in {
    val result = dateFormatter.parseDateTime(Fixtures.startDate)
    result.getYear should be(2018)
  }

  def testDecoding[T](fixture: String)(implicit decoder: Decoder[T]) = {
    val decodeResult = decode[T](fixture)
    decodeResult.fold(
      e => fail(e.getMessage),
      _ => succeed
    )
  }
}
