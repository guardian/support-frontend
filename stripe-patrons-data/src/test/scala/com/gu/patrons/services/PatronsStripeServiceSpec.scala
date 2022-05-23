package com.gu.patrons.services

import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.model.StripeSubscription
import com.gu.supporterdata.model.Stage.{DEV, PROD}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.duration._

@IntegrationTest
class PatronsStripeServiceSpec extends AsyncFlatSpec with Matchers {

  "PatronsStripeService" should "get subscriptions from Stripe" in {
    PatronsStripeConfig
      .fromParameterStore(DEV)
      .flatMap { config =>
        val stripeService = new PatronsStripeService(config, configurableFutureRunner(60.seconds))
        stripeService.getSubscriptions(1).map { response =>
          response.data.length should be > 0
          response.hasMore shouldBe true
          response.data.head.customer.email.length should be > 0
          response.data.head.status shouldBe "active"
        }
      }
  }

}
