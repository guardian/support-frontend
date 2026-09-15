package com.gu.support.config

import com.typesafe.config.ConfigFactory
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionsApiConfigSpec extends AsyncFlatSpec with Matchers {
  "PromotionsApiConfig.fromConfig" should "load apiKey when present" in {
    PromotionsApiConfig
      .fromConfig(
        ConfigFactory.parseString("""environment = "CODE"
          |promotionsApi.url = "https://example.com"
          |promotionsApi.key = "a-key"
          |""".stripMargin),
      )
      .apiKey shouldBe "a-key"
  }

  it should "fail to load, rather than silently continuing, when apiKey is absent from config" in {
    assertThrows[com.typesafe.config.ConfigException.Missing] {
      PromotionsApiConfig.fromConfig(
        ConfigFactory.parseString("""environment = "CODE"
            |promotionsApi.url = "https://example.com"
            |""".stripMargin),
      )
    }
  }
}
