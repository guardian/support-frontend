package com.gu.patrons.services

import com.gu.patrons.conf.{PatronsIdentityConfig, StripePatronsConfig}
import com.gu.supporterdata.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class ConfigServiceSpec extends AsyncFlatSpec with Matchers {

  StripePatronsConfig.getClass.getSimpleName should "load config from SSM" in {
    StripePatronsConfig
      .fromParameterStore(DEV)
      .map { config =>
        config.apiKey.length should be > 0
      }
  }

  PatronsIdentityConfig.getClass.getSimpleName should "load config from SSM" in {
    PatronsIdentityConfig
      .fromParameterStore(DEV)
      .map { config =>
        config.apiClientToken.length should be > 0
        config.apiUrl shouldBe "https://idapi.code.dev-theguardian.com"
        config.testUserSecret.length should be > 0
      }
  }

}
