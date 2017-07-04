package com.gu.support.workers

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, InputStream}

import com.gu.support.workers.Fixtures.{createPayPalPaymentMethodJson, wrap}
import com.gu.support.workers.lambdas._
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class EndToEndSpec extends LambdaSpec {
  "The monthly contribution lambdas" should "chain successfully" in {
    logger.info(createPayPalPaymentMethodJson)
    val output = wrap(createPayPalPaymentMethodJson)
      .chain(new CreatePaymentMethod())
      .chain(new CreateSalesforceContact())
      .chain(new CreateZuoraSubscription())
      .last(new SendThankYouEmail())

    assertUnit(output)
  }

  implicit class InputStreamChaining(val stream: InputStream) {
    def chain(handler: Handler[_, _]): InputStream = {
      new ByteArrayInputStream(last(handler).toByteArray)
    }

    def last(handler: Handler[_, _]): ByteArrayOutputStream = {
      val output = new ByteArrayOutputStream()
      handler.handleRequest(stream, output, context)
      output
    }
  }

}
