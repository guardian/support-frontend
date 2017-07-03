package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ServiceProvider
import com.gu.support.workers.Fixtures.{createZuoraSubscriptionJson, wrap}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.exceptions.RetryUnlimited
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures.{incorrectPaymentMethod, invalidSubscriptionRequest}
import com.gu.zuora.ZuoraService
import com.gu.zuora.model.ZuoraErrorResponse
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.RecoverMethods

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

@IntegrationTest
class ZuoraErrorsSpec extends LambdaSpec with MockWebServerCreator with MockServicesCreator with RecoverMethods with LazyLogging {
  "Subscribe request with invalid term type" should "fail with a ZuoraErrorResponse" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(30.seconds))
    recoverToSucceededIf[ZuoraErrorResponse] {
      zuoraService.subscribe(invalidSubscriptionRequest).map {
        response =>
          logger.info(s"response: $response")
      }
    }
  }

  "Subscribe request with incorrect PaymentMethod" should "fail with a ZuoraErrorResponse" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(30.seconds))
    recoverToSucceededIf[ZuoraErrorResponse] {
      zuoraService.subscribe(incorrectPaymentMethod).map {
        response =>
          logger.info(s"response: $response")
      }
    }
  }

  "Timeouts from Zuora" should "throw a RetryUnlimited" in {
    val createZuoraSubscription = new CreateZuoraSubscription(timeoutServices)
    val outputStream = new ByteArrayOutputStream()
    a[RetryUnlimited] should be thrownBy {
      createZuoraSubscription.handleRequest(wrap(createZuoraSubscriptionJson), outputStream, context)
    }
  }

  "500s from Zuora" should "throw a RetryUnlimited" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(Some(baseUrl.toString))

    val createZuoraSubscription = new CreateZuoraSubscription(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createZuoraSubscription.handleRequest(wrap(createZuoraSubscriptionJson), outStream, context)
    }

    server.shutdown()
  }

  val timeoutServices = errorServices(None, 1.milliseconds)

  def errorServices(baseUrl: Option[String], timeout: Duration = 10.seconds): ServiceProvider = mockServices(
    s => s.zuoraService,
    new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(timeout), baseUrl)
  )

}
