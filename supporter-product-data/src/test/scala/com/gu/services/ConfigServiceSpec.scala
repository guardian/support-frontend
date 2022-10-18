package com.gu.services

import com.gu.supporterdata.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class ConfigServiceSpec extends AsyncFlatSpec with Matchers {

  ConfigService.getClass.getSimpleName should "load config from SSM" in {
    val config = ConfigService(DEV).load
    config.url shouldBe "https://rest.apisandbox.zuora.com/v1/"
    config.username shouldNot be("")
    config.password shouldNot be("")
    config.discountProductRatePlanIds shouldBe List("2c92c0f852f2ebb20152f9269f067819")
    config.lastSuccessfulQueryTime shouldBe defined
  }

}
