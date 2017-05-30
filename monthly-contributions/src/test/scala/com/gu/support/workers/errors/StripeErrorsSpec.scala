package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream
import java.net.SocketTimeoutException

import com.gu.config.Configuration
import com.gu.helpers.WebServiceHelperError
import com.gu.okhttp.RequestRunners
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.Conversions.StringInputStreamConversions
import com.gu.support.workers.Fixtures.createStripePaymentMethodJson
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.lambdas.CreatePaymentMethod
import io.circe.generic.auto._
import io.circe.syntax._
import okhttp3.mockwebserver.{MockResponse, MockWebServer}
import org.mockito.Matchers.any
import org.mockito.Mockito.when

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class StripeErrorsSpec extends LambdaSpec {
  "Timeouts from Stripe" should "throw a SocketTimeoutException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeOutServices)

    val outStream = new ByteArrayOutputStream()

    a[SocketTimeoutException] should be thrownBy {
      createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)
    }
  }

  "500s from services" should "throw a WebServiceHelperError" in {
    val server = getMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    //A generic 500 should throw a WebServiceHelperError
    a[WebServiceHelperError[Stripe.Error]] should be thrownBy {
      createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)
    }

    // Shut down the server. Instances cannot be reused.
    server.shutdown()
  }

  "402s from Stripe" should "be parsable" in {
    val errorJson = Stripe.Error("card_error", "The card has expired", "expired_card").asJson.noSpaces
    val server = getMockServer(402, errorJson)
    val baseUrl = server.url("/v1")

    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[Stripe.Error] should be thrownBy {
      createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)
    }

    server.shutdown()
  }

  private def getMockServer(responseCode: Int, body: String) = {
    // Create a MockWebServer. These are lean enough that you can create a new
    // instance for every unit test.
    val server = new MockWebServer
    // Add the response which you want to serve
    server.enqueue(new MockResponse().setResponseCode(responseCode).setBody(body))
    server.start()
    server
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
