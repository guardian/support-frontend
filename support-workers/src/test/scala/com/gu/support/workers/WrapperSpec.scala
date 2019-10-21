package com.gu.support.workers

import com.gu.monitoring.SafeLogger
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonFixtures.{contribution, wrapFixture}
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.states.CreateSalesforceContactState
import io.circe.generic.auto._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class WrapperSpec extends AnyFlatSpec with Matchers {
  "JsonWrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(contribution())

    val result = Encoding.in[Contribution](wrapped)
    result.isSuccess should be(true)
  }

  it should "be able to handle a JsonWrapper with messages" in {
    val result = Encoding.in[CreateSalesforceContactState](JsonFixtures.wrapperWithMessages.asInputStream)
    SafeLogger.info(s"$result")
    result.isSuccess should be(true)
  }
}
