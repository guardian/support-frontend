package com.gu.support.workers

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, InputStream}

import com.gu.i18n.Currency
import com.gu.i18n.Currency.{EUR, GBP}
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.JsonFixtures.{createStripeSourcePaymentMethodContributionJson, wrapFixture}
import com.gu.support.workers.lambdas._
import com.gu.test.tags.annotations.IntegrationTest
import io.circe
import io.circe.parser._
import org.scalatest.Assertion

import scala.concurrent.Future
import scala.io.Source

@IntegrationTest
class EndToEndSpec extends AsyncLambdaSpec with MockContext {

  // This takes a long time to run so we probably don't want to run it on every test run

  ignore should "chain successfully" in runSignupWithCurrency(GBP)

  ignore should "work with other currencies" in runSignupWithCurrency(EUR)

  def runSignupWithCurrency(currency: Currency): Future[Assertion] = {
    val json = createStripeSourcePaymentMethodContributionJson(currency = currency)
    SafeLogger.info(json)
    val output = Future
      .successful(wrapFixture(json))
      .chain(new CreatePaymentMethod())
      .chain(new CreateSalesforceContact())
      .chain(new CreateZuoraSubscription())
      .parallel(
        new SendThankYouEmail(),
        new SendAcquisitionEvent(
          MockAcquisitionHelper.mockServices,
        ), // We have to mock the acquisition service - there doesn't seem to be a test mode
      )
      .last()

    output.map { output =>
      val decoded: Either[circe.Error, List[JsonWrapper]] = decode[List[JsonWrapper]](output.toString("utf-8"))
      withClue(s"decoded: $decoded") {
        decoded.map(_.size) should be(Right(2))
      }
    }
  }

  implicit class InputStreamChaining(val stream: Future[InputStream]) {

    def parallel(handlers: Handler[_, _]*): Future[InputStream] = {
      val listStartMarker = Array[Byte]('[')
      val listEndMarker = Array[Byte](']')
      val listSeparator = Array[Byte](',')

      val output = new ByteArrayOutputStream()

      output.write(listStartMarker)

      stream.flatMap { stream =>
        val parallelTasks = handlers.zipWithIndex.foldLeft(Future.successful(())) { case (future, (handler, index)) =>
          future.flatMap { _ =>
            if (index != 0) output.write(listSeparator)
            handler.handleRequestFuture(stream, output, context).map { _ =>
              stream.reset()
            }
          }
        }

        parallelTasks.map { _ =>
          output.write(listEndMarker)
          new ByteArrayInputStream(output.toByteArray)
        }
      }
    }

    def chain(handler: Handler[_, _]): Future[InputStream] = {
      last(handler).map(stream => new ByteArrayInputStream(stream.toByteArray))
    }

    def last(handler: Handler[_, _]): Future[ByteArrayOutputStream] = stream flatMap { stream =>
      val output = new ByteArrayOutputStream()
      SafeLogger.info(s"calling handler: ${handler.getClass}")
      handler.handleRequestFuture(stream, output, context).map { _ =>
        SafeLogger.info(s"finished handler: ${handler.getClass}")
        output
      }
    }

    def last(): Future[ByteArrayOutputStream] = stream map { stream =>
      val output = new ByteArrayOutputStream()
      output.write(Source.fromInputStream(stream).mkString.getBytes)
      output
    }
  }

}
