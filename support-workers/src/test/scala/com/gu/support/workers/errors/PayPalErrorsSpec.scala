package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.paypal.PayPalService
import com.gu.support.config.PayPalConfig
import com.gu.support.workers.JsonFixtures.{createPayPalPaymentMethodDigitalPackJson, wrapFixture}
import com.gu.support.workers.exceptions.RetryUnlimited
import com.gu.support.workers.lambdas.CreatePaymentMethod
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}

import scala.concurrent.duration._

class PayPalErrorsSpec extends AsyncLambdaSpec with MockWebServerCreator with MockServicesCreator with MockContext {
  "Timeouts from PayPal" should "throw a NonFatalException" in {
    val createPaymentMethod = new CreatePaymentMethod(timeOutServices)

    val outStream = new ByteArrayOutputStream()

    recoverToSucceededIf[RetryUnlimited] {
      createPaymentMethod.handleRequestFuture(wrapFixture(createPayPalPaymentMethodDigitalPackJson), outStream, context)
    }
  }

  "500s from PayPal" should "throw a NonFatalException" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(baseUrl.toString)

    val createPaymentMethod = new CreatePaymentMethod(services)

    val outStream = new ByteArrayOutputStream()

    val assertion = recoverToSucceededIf[RetryUnlimited] {
      createPaymentMethod.handleRequestFuture(wrapFixture(createPayPalPaymentMethodDigitalPackJson), outStream, context)
    }
    assertion.onComplete { _ =>
      // Shut down the server. Instances cannot be reused.
      server.shutdown()
    }
    assertion
  }

  lazy private val timeOutServices = mockService(
    s => s.payPalService,
    new PayPalService(
      Configuration.load().payPalConfigProvider.get(),
      RequestRunners.configurableFutureRunner(1.milliseconds),
    ),
  )

  private def errorServices(baseUrl: String) = {
    val conf = Configuration.load().payPalConfigProvider.get()
    val mockConfig =
      PayPalConfig(conf.payPalEnvironment, conf.NVPVersion, baseUrl, conf.user, conf.password, conf.signature)
    val payPal = new PayPalService(mockConfig, RequestRunners.configurableFutureRunner(10.seconds))
    mockService(
      s => s.payPalService,
      payPal,
    )
  }

}
