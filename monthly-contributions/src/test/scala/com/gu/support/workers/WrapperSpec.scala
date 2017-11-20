package com.gu.support.workers

import com.gu.support.workers.Conversions.StringInputStreamConversions
import com.gu.support.workers.Fixtures.{contribution, oldJsonWrapper, wrapFixture}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.model.JsonWrapper
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.zuora.encoding.CustomCodecs._
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.{FlatSpec, Matchers}

class WrapperSpec extends FlatSpec with Matchers with LazyLogging {
  "JsonWrapper" should "be able to round trip some json" in {
    val wrapped = wrapFixture(contribution())

    val result = Encoding.in[Contribution](wrapped)
    result.isSuccess should be(true)
  }

  it should "be able to handle versions of the json with a missing requestInformation parameter" in {
    val contribution = Encoding.in[Contribution](oldJsonWrapper.asInputStream)
    contribution.isSuccess should be(true)
  }

  "The JsonWrapperDecoder" should "be able to handle old versions of the json" in {
    val jsonWrapper = decode[JsonWrapper](oldJsonWrapper)
    jsonWrapper.right.get.requestInformation.testUser should be(false)
  }
}
