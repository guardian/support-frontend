package com.gu.support.config

import com.typesafe.config.ConfigFactory
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionsApiConfigSpec extends AnyFlatSpec with Matchers {
  "PromotionsApiConfig" should "load both keys when present" in {
    val config = ConfigFactory.parseString("""
        |promotionsApi {
        |  code.key = "code-key"
        |  prod.key = "prod-key"
        |}
        |""".stripMargin)

    val result = PromotionsApiConfig.fromConfig(config)
    result.codeApiKey shouldBe Some("code-key")
    result.prodApiKey shouldBe Some("prod-key")
  }

  it should "default to None for either key when absent, rather than failing to load" in {
    val result = PromotionsApiConfig.fromConfig(ConfigFactory.empty())
    result.codeApiKey shouldBe None
    result.prodApiKey shouldBe None
  }
}
