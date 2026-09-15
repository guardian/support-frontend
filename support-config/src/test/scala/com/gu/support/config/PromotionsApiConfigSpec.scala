package com.gu.support.config

import com.typesafe.config.ConfigFactory
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionsApiConfigSpec extends AsyncFlatSpec with Matchers {
  "PromotionsApiConfigProvider" should "resolve the CODE environment/url for a CODE-deployed app, for both default and test users" in {
    val provider = new PromotionsApiConfigProvider(ConfigFactory.load(), Stages.CODE)

    provider.get().environment shouldBe TouchPointEnvironments.CODE
    provider.get().url shouldBe "https://promotions-api-code.support.guardianapis.com"

    provider.get(isTestUser = true).environment shouldBe TouchPointEnvironments.CODE
    provider.get(isTestUser = true).url shouldBe "https://promotions-api-code.support.guardianapis.com"
  }

  it should "resolve the PROD environment/url for regular users of a PROD-deployed app, but CODE for test users" in {
    val provider = new PromotionsApiConfigProvider(ConfigFactory.load(), Stages.PROD)

    provider.get().environment shouldBe TouchPointEnvironments.PROD
    provider.get().url shouldBe "https://promotions-api.support.guardianapis.com"

    provider.get(isTestUser = true).environment shouldBe TouchPointEnvironments.CODE
    provider.get(isTestUser = true).url shouldBe "https://promotions-api-code.support.guardianapis.com"
  }

  it should "load apiKey when present" in {
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
