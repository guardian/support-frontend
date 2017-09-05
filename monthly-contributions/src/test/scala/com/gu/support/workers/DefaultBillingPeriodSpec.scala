package com.gu.support.workers

import com.gu.support.workers.Fixtures.{annualContributionJson, monthlyContributionJson}
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{Annual, Monthly}
import com.gu.zuora.encoding.CustomCodecs.{decodeContribution, decodeCurrency, decodePeriod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class DefaultBillingPeriodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "Contribution JSON with no billing period set" should "default to Monthly" in {
    val contribution = decode[Contribution](monthlyContributionJson)
    contribution.isRight should be(true)
    contribution.right.get.billingPeriod should be(Monthly)
  }

  "Contribution JSON with a billing period set" should "be decoded correctly" in {
    val contribution = decode[Contribution](annualContributionJson)
    contribution.isRight should be(true)
    contribution.right.get.billingPeriod should be(Annual)
  }
}
