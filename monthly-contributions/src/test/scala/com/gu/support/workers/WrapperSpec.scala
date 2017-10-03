package com.gu.support.workers

import com.gu.support.workers.Fixtures.{monthlyContributionJson, oldJsonWrapper, wrapFixture}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.zuora.encoding.CustomCodecs._
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class WrapperSpec extends FlatSpec with Matchers with LazyLogging {
  "JsonWrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(monthlyContributionJson)

    val contribution = Encoding.in[Contribution](wrapped)
    contribution.isSuccess should be(true)
  }

  it should "be able to handle old versions of the json with a missing encrypted parameter" in {
    val contribution = Encoding.in[Contribution](oldJsonWrapper)
    contribution.isSuccess should be(true)
  }
}
