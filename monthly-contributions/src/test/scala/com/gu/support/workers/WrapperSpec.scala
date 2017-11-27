package com.gu.support.workers

import com.gu.support.workers.Fixtures.{contribution, wrapFixture}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.zuora.encoding.CustomCodecs._
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

class WrapperSpec extends FlatSpec with Matchers with LazyLogging {
  "JsonWrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(contribution())

    val result = Encoding.in[Contribution](wrapped)
    result.isSuccess should be(true)
  }
}
