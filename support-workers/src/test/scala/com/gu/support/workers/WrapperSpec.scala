package com.gu.support.workers

import com.gu.monitoring.SafeLogger
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonFixtures.{contribution, wrapFixture}
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Encoding
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class WrapperSpec extends AnyFlatSpec with Matchers {
  "JsonWrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(contribution())

    val result = Encoding.in[Contribution](wrapped)
    result.isSuccess should be(true)
  }

}
