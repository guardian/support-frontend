package com.gu.patrons.services

import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.supporterdata.model.Stage.CODE
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class ConfigServiceSpec extends AsyncFlatSpec with Matchers {

  PatronsStripeConfig.getClass.getSimpleName should "load config from SSM" in {
    val config = PatronsStripeConfig
      .fromParameterStoreSync(CODE)

    config.apiKey.length should be > 0
  }

  PatronsIdentityConfig.getClass.getSimpleName should "load config from SSM" in {
    val config = PatronsIdentityConfig
      .fromParameterStoreSync(CODE)

    config.apiClientToken.length should be > 0
    config.apiUrl shouldBe "https://idapi.code.dev-theguardian.com"
  }

}
