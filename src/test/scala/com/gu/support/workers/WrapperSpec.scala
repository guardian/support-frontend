package com.gu.support.workers

import com.gu.monitoring.SafeLogger
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.Fixtures.{contribution, wrapFixture}
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.states.CreateSalesforceContactState
import io.circe.generic.auto._
import org.scalatest.{FlatSpec, Matchers}

class WrapperSpec extends FlatSpec with Matchers {
  "JsonWrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(contribution())

    val result = Encoding.in[Contribution](wrapped)
    result.isSuccess should be(true)
  }

  it should "be able to handle a JsonWrapper with messages" in {
    val result = Encoding.in[CreateSalesforceContactState](Fixtures.wrapperWithMessages.asInputStream)
    SafeLogger.info(s"$result")
    result.isSuccess should be(true)
  }
}
