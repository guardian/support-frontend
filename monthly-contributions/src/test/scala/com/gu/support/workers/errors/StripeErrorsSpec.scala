package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ServiceProvider
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.Fixtures.{createMonthlyStripeJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.exceptions.{RetryNone, RetryUnlimited}
import com.gu.support.workers.lambdas.CreatePaymentMethod
import io.circe.syntax._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class StripeErrorsSpec extends LambdaSpec with MockWebServerCreator with MockServicesCreator {
  "Timeouts from Stripe" should "throw a NonFatalException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeoutServices)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createPaymentMethod.handleRequest(wrapFixture(createMonthlyStripeJson), outStream, context)
    }
  }

  "500s from Stripe" should "throw a NonFatalException" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createPaymentMethod.handleRequest(wrapFixture(createMonthlyStripeJson), outStream, context)
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
      createPaymentMethod.handleRequest(wrapFixture(createMonthlyStripeJson), outStream, context)
    }

    server.shutdown()
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
