package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import cats.syntax.either._
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ServiceProvider
import com.gu.support.workers.Fixtures.{createZuoraSubscriptionJson, wrapFixture}
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.exceptions.RetryUnlimited
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.model.JsonWrapper
import com.gu.support.workers.{Fixtures, LambdaSpec}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures.{incorrectPaymentMethod, invalidSubscriptionRequest}
import com.gu.zuora.ZuoraService
import com.gu.zuora.encoding.CustomCodecs.jsonWrapperDecoder
import com.gu.zuora.model.response.ZuoraErrorResponse
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode
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
      createZuoraSubscription.handleRequest(wrapFixture(createZuoraSubscriptionJson()), outputStream, context)
    }
  }

  "500s from Zuora" should "throw a RetryUnlimited" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(Some(baseUrl.toString))

    val createZuoraSubscription = new CreateZuoraSubscription(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createZuoraSubscription.handleRequest(wrapFixture(createZuoraSubscriptionJson()), outStream, context)
    }

    server.shutdown()
  }

  "JsonWrapped error" should "deserialise correctly" in {

    val zuoraErrorResponse = for {
      wrapper <- decode[JsonWrapper](Fixtures.cardDeclinedJsonZuora).toOption
      executionError <- wrapper.error
      errorJson <- decode[ErrorJson](executionError.Cause).toOption
      zuoraErrorResponse <- decode[ZuoraErrorResponse](errorJson.errorMessage).toOption
    } yield zuoraErrorResponse

    zuoraErrorResponse.get.errors.head.Code should be("TRANSACTION_FAILED")
  }

  private val timeoutServices = errorServices(None, 1.milliseconds)

  def errorServices(baseUrl: Option[String], timeout: Duration = 10.seconds): ServiceProvider = mockServices(
    s => s.zuoraService,
    new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(timeout), baseUrl)
  )

}
