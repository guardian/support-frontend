package com.gu.support.getaddressio

import com.gu.okhttp.RequestRunners
import com.gu.support.config.GetAddressIOConfig
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.config.ConfigFactory
import org.scalatest.{AsyncFlatSpec, Matchers}

@IntegrationTest
class GetAddressIOServiceSpec extends AsyncFlatSpec with Matchers {
  "GetAddressService" should "be able to find a postcode" in {
    val service = new GetAddressIOService(GetAddressIOConfig.fromConfig(ConfigFactory.load()), RequestRunners.futureRunner)
    service.find("N19GU").map(_.Addresses.nonEmpty shouldBe true)
  }
}
