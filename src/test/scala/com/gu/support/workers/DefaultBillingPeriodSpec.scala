package com.gu.support.workers

import com.gu.support.workers.Fixtures.contribution
import com.gu.support.workers.model.{Annual, Contribution}
import com.gu.zuora.encoding.CustomCodecs.{decodeContribution, decodeCurrency, decodePeriod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class DefaultBillingPeriodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "Contribution JSON with a billing period set" should "be decoded correctly" in {
    val input = contribution(billingPeriod = Annual)
    val result = decode[Contribution](input)
    result.isRight should be(true)
    result.right.get.billingPeriod should be(Annual)
  }
}
