package com.gu.support.workers

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, InputStream}

import com.gu.i18n.Currency
import com.gu.i18n.Currency.{EUR, GBP}
import com.gu.monitoring.SafeLogger
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.Fixtures.{createPayPalPaymentMethodContributionJson, wrapFixture}
import com.gu.support.workers.lambdas._
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.generic.auto._
import io.circe.parser._

import scala.io.Source

@IntegrationTest
class EndToEndSpec extends LambdaSpec {

  "The monthly contribution lambdas" should "chain successfully" in runSignupWithCurrency(GBP)

  they should "work with other currencies" in runSignupWithCurrency(EUR)

  def runSignupWithCurrency(currency: Currency) {
    SafeLogger.info(createPayPalPaymentMethodContributionJson(currency))
    val output = wrapFixture(createPayPalPaymentMethodContributionJson(currency))
      .chain(new CreatePaymentMethod())
      .chain(new CreateSalesforceContact())
      .chain(new CreateZuoraSubscription())
      .parallel(
        new SendThankYouEmail(),
        new SendAcquisitionEvent(MockAcquisitionHelper.mockServices) //We have to mock the acquisition service - there doesn't seem to be a test mode
      )
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
