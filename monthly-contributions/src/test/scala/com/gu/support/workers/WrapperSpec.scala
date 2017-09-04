package com.gu.support.workers

import com.gu.support.workers.Fixtures.{monthlyContributionJson, wrapFixture}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.zuora.encoding.CustomCodecs._
import org.scalatest.{FlatSpec, Matchers}

class WrapperSpec extends FlatSpec with Matchers {
  "Wrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(monthlyContributionJson)

    val contribution = Encoding.in[Contribution](wrapped)
    contribution.isSuccess should be(true)
  }
}
