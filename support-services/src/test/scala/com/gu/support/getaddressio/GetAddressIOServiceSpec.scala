package com.gu.support.getaddressio

import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners
import com.gu.support.config.GetAddressIOConfig
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.config.ConfigFactory
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class GetAddressIOServiceSpec extends AsyncFlatSpec with Matchers {
  val service =
    new GetAddressIOService(GetAddressIOConfig.fromConfig(ConfigFactory.load()), RequestRunners.futureRunner)
  // This test is ignored because the test key is only valid for a few requests a day
  "GetAddressService" should "be able to find a postcode" ignore {
    service.find("N19GU").map { result =>
      result.nonEmpty shouldBe true
      val address = result.head
      address.postCode shouldBe Some("N19GU")
      address.lineOne shouldBe Some("The Guardian")
      address.lineTwo shouldBe Some("Kings Place")
      address.city shouldBe Some("London")
      address.state shouldBe None
      address.country shouldBe Country.UK
    }
  }

  // This test is ignored because the test key is only valid for a few requests a day
  it should "be able to find another postcode" ignore {
    service.find("NN13ER").map { result =>
      result.head.state shouldBe Some("Northamptonshire")
    }
  }
}
