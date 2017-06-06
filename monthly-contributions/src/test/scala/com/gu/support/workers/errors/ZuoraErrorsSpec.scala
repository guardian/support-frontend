package com.gu.support.workers.errors

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures.{incorrectPaymentMethod, invalidSubscriptionRequest}
import com.gu.zuora.ZuoraService
import com.gu.zuora.model.ZuoraErrorResponse
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.duration._

@IntegrationTest
class ZuoraErrorsSpec extends AsyncFlatSpec with Matchers {
  "Subscribe request with invalid term type" should "fail with a ZuoraErrorResponse" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfigProvider.get(), RequestRunners.configurableFutureRunner(30.seconds))
    recoverToSucceededIf[ZuoraErrorResponse] {
      zuoraService.subscribe(invalidSubscriptionRequest).map {
        response =>
          response.head.success should be(false)
      }
    }
  }

  "Subscribe request with incorrect PaymentMethod" should "fail with a ZuoraErrorResponse" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfigProvider.get(), RequestRunners.configurableFutureRunner(30.seconds))
    recoverToSucceededIf[ZuoraErrorResponse] {
      zuoraService.subscribe(incorrectPaymentMethod).map {
        response =>
          response.head.success should be(false)
      }
    }
  }

}
