package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.paypal.{PayPalConfig, PayPalService}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.Conversions.StringInputStreamConversions
import com.gu.support.workers.Fixtures.createPayPalPaymentMethodJson
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.exceptions.NonFatalException
import com.gu.support.workers.lambdas.CreatePaymentMethod
import org.mockito.Matchers.any
import org.mockito.Mockito.when

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class PayPalErrorsSpec extends LambdaSpec with MockWebServerCreator {
  "Timeouts from PayPal" should "throw a NonFatalException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeOutServices)

    val outStream = new ByteArrayOutputStream()

    a[NonFatalException] should be thrownBy {
      createPaymentMethod.handleRequest(createPayPalPaymentMethodJson.asInputStream(), outStream, context)
    }
  }

  "500s from PayPal" should "throw a NonFatalException" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    a[NonFatalException] should be thrownBy {
      createPaymentMethod.handleRequest(createPayPalPaymentMethodJson.asInputStream(), outStream, context)
    }

    // Shut down the server. Instances cannot be reused.
    server.shutdown()
  }

  lazy val timeOutServices = {
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    //Create a Service which will timeout
    val payPal = new PayPalService(Configuration.payPalConfigProvider.get(), RequestRunners.configurableFutureRunner(1.milliseconds))
    when(services.payPalService).thenReturn(payPal)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

  private def errorServices(baseUrl: String) = {
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    //Create a PayPalService which will timeout
    val conf = Configuration.payPalConfigProvider.get()
    val mockConfig = PayPalConfig(conf.payPalEnvironment, conf.NVPVersion, baseUrl, conf.user,conf.password, conf.signature)
    val payPal = new PayPalService(mockConfig, RequestRunners.configurableFutureRunner(10.seconds))
    when(services.payPalService).thenReturn(payPal)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }

}
