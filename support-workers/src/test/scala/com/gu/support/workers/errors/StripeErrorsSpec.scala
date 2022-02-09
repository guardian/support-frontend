package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ServiceProvider
import com.gu.stripe.{StripeError, StripeService}
import com.gu.support.encoding.ErrorJson
import com.gu.support.workers.JsonFixtures.{createStripeSourcePaymentMethodContributionJson, wrapFixture}
import com.gu.support.workers.exceptions.{RetryNone, RetryUnlimited}
import com.gu.support.workers.lambdas.CreatePaymentMethod
import com.gu.support.workers.{AsyncLambdaSpec, JsonFixtures, JsonWrapper, MockContext}
import io.circe.Json
import io.circe.parser.decode
import io.circe.syntax._

import scala.concurrent.duration._

class StripeErrorsSpec extends AsyncLambdaSpec with MockWebServerCreator with MockServicesCreator with MockContext {
  "Timeouts from Stripe" should "throw a NonFatalException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeoutServices)

    val outStream = new ByteArrayOutputStream()

    recoverToSucceededIf[RetryUnlimited] {
      createPaymentMethod.handleRequestFuture(
        wrapFixture(createStripeSourcePaymentMethodContributionJson()),
        outStream,
        context,
      )
    }
  }

  "500s from Stripe" should "throw a NonFatalException" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    val assertion = recoverToSucceededIf[RetryUnlimited] {
      createPaymentMethod.handleRequestFuture(
        wrapFixture(createStripeSourcePaymentMethodContributionJson()),
        outStream,
        context,
      )
    }
    assertion.onComplete { _ =>
      // Shut down the server. Instances cannot be reused.
      server.shutdown()
    }
    assertion
  }

  "402s from Stripe" should "throw a FatalException" in {
    import io.circe.generic.semiauto.deriveEncoder
    implicit val encoder = deriveEncoder[StripeError].mapJson { json => Json.fromFields(List("error" -> json)) }

    val errorJson = StripeError("card_error", "The card has expired", Some("expired_card")).asJson.noSpaces
    val server = createMockServer(402, errorJson)
    val baseUrl = server.url("/v1")

    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    val assertion = recoverToSucceededIf[RetryNone] {
      createPaymentMethod.handleRequestFuture(
        wrapFixture(createStripeSourcePaymentMethodContributionJson()),
        outStream,
        context,
      )
    }
    assertion.onComplete { _ =>
      server.shutdown()
    }
    assertion
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
      """,
    )
    err.isRight should be(true)
    err.toOption.get.code should be(Some("card_declined"))
  }

  "JsonWrapped error" should "deserialise correctly" in {
    val stripeError = for {
      wrapper <- decode[JsonWrapper](JsonFixtures.cardDeclinedJsonStripe)
      executionError <- wrapper.error.toRight("wrapper.error was empty")
      errorJson <- decode[ErrorJson](executionError.Cause)
      stripeError <- decode[StripeError](errorJson.errorMessage)
    } yield stripeError

    stripeError.flatMap(_.code.toRight("no code")) should be(Right("card_declined"))
  }

  private lazy val timeoutServices = mockService(
    s => s.stripeService,
    // Create a stripe service which will timeout after 1 millisecond
    new StripeService(Configuration.load().stripeConfigProvider.get(), configurableFutureRunner(1.milliseconds)),
  )

  def errorServices(baseUrl: String): ServiceProvider = {
    mockService(
      s => s.stripeService,
      new StripeService(Configuration.load().stripeConfigProvider.get(), configurableFutureRunner(10.seconds), baseUrl),
    )
  }

}
