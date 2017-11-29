package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import cats.syntax.either._
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ServiceProvider
import com.gu.stripe.Stripe.StripeError
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.Fixtures.{createStripePaymentMethodJson, wrapFixture}
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.exceptions.{RetryNone, RetryUnlimited}
import com.gu.support.workers.lambdas.CreatePaymentMethod
import com.gu.support.workers.model.JsonWrapper
import com.gu.support.workers.{Fixtures, LambdaSpec}
import com.gu.zuora.encoding.CustomCodecs.jsonWrapperDecoder
import io.circe.parser.decode
import io.circe.syntax._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class StripeErrorsSpec extends LambdaSpec with MockWebServerCreator with MockServicesCreator {
  "Timeouts from Stripe" should "throw a NonFatalException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeoutServices)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createPaymentMethod.handleRequest(wrapFixture(createStripePaymentMethodJson()), outStream, context)
    }
  }

  "500s from Stripe" should "throw a NonFatalException" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createPaymentMethod.handleRequest(wrapFixture(createStripePaymentMethodJson()), outStream, context)
    }

    // Shut down the server. Instances cannot be reused.
    server.shutdown()
  }

  "402s from Stripe" should "throw a FatalException" in {
    val errorJson = Stripe.StripeError("card_error", "The card has expired", Some("expired_card")).asJson.noSpaces
    val server = createMockServer(402, errorJson)
    val baseUrl = server.url("/v1")

    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryNone] should be thrownBy {
      createPaymentMethod.handleRequest(wrapFixture(createStripePaymentMethodJson()), outStream, context)
    }

    server.shutdown()
  }

  "Stripe error" should "deserialise correctly" in {
    val err = decode[StripeError](
      """{
          "error": {
            "message": "Your card was declined.",
            "type": "card_error",
            "param": "",
            "code": "card_declined",
            "decline_code": "generic_decline"
          }
        }
      """
    )
    err.isRight should be(true)
    err.right.get.code should be(Some("card_declined"))
  }

  "JsonWrapped error" should "deserialise correctly" in {
    val stripeError = for{
      wrapper <- decode[JsonWrapper](Fixtures.cardDeclinedJsonStripe).toOption
      executionError <- wrapper.error
      errorJson <- decode[ErrorJson](executionError.Cause).toOption
      stripeError <- decode[StripeError](errorJson.errorMessage).toOption
    } yield stripeError

    stripeError.get.code should be(Some("card_declined"))
  }

  private lazy val timeoutServices = mockServices(
    s => s.stripeService,
    //Create a stripe service which will timeout after 1 millisecond
    new StripeService(Configuration.stripeConfigProvider.get(), configurableFutureRunner(1.milliseconds))
  )

  def errorServices(baseUrl: String): ServiceProvider = {
    mockServices(
      s => s.stripeService,
      new StripeService(Configuration.stripeConfigProvider.get(), configurableFutureRunner(10.seconds), baseUrl)
    )
  }

}
