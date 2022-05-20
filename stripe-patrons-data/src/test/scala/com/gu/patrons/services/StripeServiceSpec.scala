package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, StripePatronsConfig}
import com.gu.supporterdata.model.Stage.{DEV, PROD}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.duration._

@IntegrationTest
class StripeServiceSpec extends AsyncFlatSpec with Matchers {

  "StripeService" should "get subscriptions from Stripe" in {
    StripePatronsConfig
      .fromParameterStore(DEV)
      .flatMap { config =>
        val stripeService = new StripeService(config, configurableFutureRunner(60.seconds))
        stripeService.getSubscriptions(1).map { response =>
          response.data.length should be > 0
          response.hasMore shouldBe true
          response.data.head.customer.email.length should be > 0
          response.data.head.status shouldBe "active"
        }

      }
  }

  "StripeIterable" should "get subscriptions from Stripe" in {
    val runner = configurableFutureRunner(60.seconds)
    for {
      stripeConfig <- StripePatronsConfig.fromParameterStore(PROD)
      stripeService = new StripeService(stripeConfig, runner)
      identityConfig <- PatronsIdentityConfig.fromParameterStore(PROD)
      identityService = new PatronsIdentityService(identityConfig, runner)
      iterable = new StripeIterable(stripeService, identityService)
      _ <- iterable.processSubscriptions
    } yield succeed
  }

}
