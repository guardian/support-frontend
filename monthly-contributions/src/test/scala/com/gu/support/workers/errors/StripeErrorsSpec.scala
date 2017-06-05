package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.Conversions.StringInputStreamConversions
import com.gu.support.workers.Fixtures.createStripePaymentMethodJson
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.exceptions.{FatalException, NonFatalException}
import com.gu.support.workers.lambdas.CreatePaymentMethod
import io.circe.syntax._
import org.mockito.Matchers.any
import org.mockito.Mockito.when

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class StripeErrorsSpec extends LambdaSpec with MockWebServerCreator {
  "Timeouts from Stripe" should "throw a NonFatalException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeOutServices)

    val outStream = new ByteArrayOutputStream()

    a[NonFatalException] should be thrownBy {
      createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)
    }
  }

  "500s from Stripe" should "throw a NonFatalException" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[NonFatalException] should be thrownBy {
      createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)
    }

    // Shut down the server. Instances cannot be reused.
    server.shutdown()
  }

  "402s from Stripe" should "throw a FatalException" in {
    val errorJson = Stripe.Error("card_error", "The card has expired", "expired_card").asJson.noSpaces
    val server = createMockServer(402, errorJson)
    val baseUrl = server.url("/v1")

    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[FatalException] should be thrownBy {
      createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)
    }

    server.shutdown()
  }

  lazy val timeOutServices = {
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    //Create a StripeService which will timeout
    val stripe = new StripeService(Configuration.stripeConfigProvider.get(), RequestRunners.configurableFutureRunner(1.milliseconds))
    when(services.stripeService).thenReturn(stripe)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

  private def errorServices(baseUrl: String) = {
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    //Create a StripeService which will timeout
    val stripe = new StripeService(Configuration.stripeConfigProvider.get(), RequestRunners.configurableFutureRunner(10.seconds), baseUrl)
    when(services.stripeService).thenReturn(stripe)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

}
