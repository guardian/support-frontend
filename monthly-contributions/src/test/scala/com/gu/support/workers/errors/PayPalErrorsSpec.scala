package com.gu.support.workers.errors

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.paypal.PayPalService
import com.gu.support.config.PayPalConfig
import com.gu.support.workers.LambdaSpec

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class PayPalErrorsSpec extends LambdaSpec with MockWebServerCreator with MockServicesCreator {
  //  "Timeouts from PayPal" should "throw a NonFatalException" in {
  //    val createPaymentMethod = new CreatePaymentMethod(timeOutServices)
  //
  //    val outStream = new ByteArrayOutputStream()
  //
  //    a[RetryUnlimited] should be thrownBy {
  //      createPaymentMethod.handleRequest(wrapFixture(createPayPalPaymentMethodJson()), outStream, context)
  //    }
  //  }
  //
  //  "500s from PayPal" should "throw a NonFatalException" in {
  //    val server = createMockServer(500, "Uh Oh!")
  //    val baseUrl = server.url("/v1")
  //    val services = errorServices(baseUrl.toString)
  //
  //    val createPaymentMethod = new CreatePaymentMethod(services)
  //
  //    val outStream = new ByteArrayOutputStream()
  //
  //    a[RetryUnlimited] should be thrownBy {
  //      createPaymentMethod.handleRequest(wrapFixture(createPayPalPaymentMethodJson()), outStream, context)
  //    }
  //
  //    // Shut down the server. Instances cannot be reused.
  //    server.shutdown()
  //  }

  lazy val timeOutServices = mockServices(
    s => s.payPalService,
    new PayPalService(Configuration.payPalConfigProvider.get(), RequestRunners.configurableFutureRunner(1.milliseconds))
  )

  private def errorServices(baseUrl: String) = {
    val conf = Configuration.payPalConfigProvider.get()
    val mockConfig = PayPalConfig(conf.payPalEnvironment, conf.NVPVersion, baseUrl, conf.user, conf.password, conf.signature)
    val payPal = new PayPalService(mockConfig, RequestRunners.configurableFutureRunner(10.seconds))
    mockServices(
      s => s.payPalService,
      payPal
    )
  }

}
