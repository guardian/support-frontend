package com.gu.support.workers

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, InputStream}

import com.gu.support.workers.Fixtures.{createPayPalPaymentMethodJson, wrapFixture}
import com.gu.support.workers.lambdas._
import com.gu.support.workers.model.JsonWrapper
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.encoding.CustomCodecs.{jsonWrapperDecoder, jsonWrapperEncoder}
import io.circe.parser._

import scala.io.Source

@IntegrationTest
class EndToEndSpec extends LambdaSpec {
  "The monthly contribution lambdas" should "chain successfully" in {
    logger.info(createPayPalPaymentMethodJson())
    val output = wrapFixture(createPayPalPaymentMethodJson())
      .chain(new CreatePaymentMethod())
      .chain(new CreateSalesforceContact())
      .chain(new CreateZuoraSubscription())
      .parallel(new ContributionCompleted, new SendThankYouEmail())
      .last()

    val decoded = decode[List[JsonWrapper]](output.toString("utf-8"))
    decoded.isRight should be(true)
    decoded.right.get.size should be(2)
  }

  implicit class InputStreamChaining(val stream: InputStream) {

    def parallel(handlers: Handler[_, _]*): InputStream = {
      val listStartMarker = Array[Byte]('[')
      val listEndMarker = Array[Byte](']')
      val listSeparator = Array[Byte](',')

      val output = new ByteArrayOutputStream()

      output.write(listStartMarker)

      handlers.zipWithIndex.foreach {
        case (handler, index) =>
          if (index != 0) output.write(listSeparator)
          handler.handleRequest(stream, output, context)
          stream.reset()
      }

      output.write(listEndMarker)

      new ByteArrayInputStream(output.toByteArray)
    }

    def chain(handler: Handler[_, _]): InputStream = {
      new ByteArrayInputStream(last(handler).toByteArray)
    }

    def last(handler: Handler[_, _]): ByteArrayOutputStream = {
      val output = new ByteArrayOutputStream()
      handler.handleRequest(stream, output, context)
      output
    }

    def last(): ByteArrayOutputStream = {
      val output = new ByteArrayOutputStream()
      output.write(Source.fromInputStream(stream).mkString.getBytes)
      output
    }
  }

}
