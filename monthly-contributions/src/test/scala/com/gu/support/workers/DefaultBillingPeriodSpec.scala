package com.gu.support.workers

import com.gu.support.workers.Fixtures.contribution
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{Annual, Monthly}
import com.gu.zuora.encoding.CustomCodecs.{decodeContribution, decodeCurrency, decodePeriod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class DefaultBillingPeriodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "Contribution JSON with no billing period set" should "default to Monthly" in {
    val json =
      """
      {
        "amount": 5,
        "currency": "GBP"
      }
    """
    val result = decode[Contribution](json)
    result.isRight should be(true)
    result.right.get.billingPeriod should be(Monthly)
  }

  "Contribution JSON with a billing period set" should "be decoded correctly" in {
    val result = decode[Contribution](contribution(billingPeriod = Annual))
    result.isRight should be(true)
    result.right.get.billingPeriod should be(Annual)
  }
}
