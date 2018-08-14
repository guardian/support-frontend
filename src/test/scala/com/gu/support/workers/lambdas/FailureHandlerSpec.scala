package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.emailservices.{EmailService, FailedContributionEmailFields, FailedDigitalPackEmailFields}
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.model.CheckoutFailureReasons.PaymentMethodUnacceptable
import com.gu.support.workers.model.JsonWrapper
import com.gu.support.workers.{Fixtures, LambdaSpec}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.encoding.CustomCodecs._
import com.gu.zuora.model.response.{ZuoraError, ZuoraErrorResponse}
import io.circe.parser.decode
import org.mockito.Mockito.{times, verify, when}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.io.Source

@IntegrationTest
class FailureHandlerSpec extends LambdaSpec {

  ignore should "send a failure email" in {
    //This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService
    val email = "rupert.bates@theguardian.com"
    service
      .send(FailedContributionEmailFields(email))
      .map(result => result.getMessageId should not be "")
  }

  "FailureHandler lambda" should "return a failed JsonWrapper for any errors except payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(failureJson.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(true)
  }

  "FailureHandler lambda" should "still return a failed JsonWrapper if it receives the old schema" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(oldSchemaFailureJson.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(true)
  }

  it should "return a non failed JsonWrapper for Zuora payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonZuora.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(false)
    SafeLogger.info(outState.right.get.requestInfo.messages.head)
  }

  it should "return a non failed JsonWrapper for Stripe payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonStripe.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(false)
    SafeLogger.info(outState.right.get.requestInfo.messages.head)
  }

  it should "return a non failed JsonWrapper for Stripe payment errors for a digital pack, too" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(digipackCardDeclinedStripeJson.asInputStream, outStream, context)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(false)

    SafeLogger.warn(outState.right.get.requestInfo.messages.head)
  }

  it should "digital pack: send an email with FailedDigitalPackEmailFields when there are Stripe payment errors " in {

    val emailService = mock[EmailService]
    val result = mock[SendMessageResult]
    val testFields = FailedDigitalPackEmailFields("test@gu.com")

    when(emailService.send(testFields)).thenReturn(Future.successful(result))

    val failureHandler = new FailureHandler(emailService)

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(digipackCardDeclinedStripeJson.asInputStream, outStream, context)

    verify(emailService, times(1)).send(testFields)

    val outState = decode[JsonWrapper](Source.fromInputStream(outStream.toInputStream).mkString)
    outState.right.get.requestInfo.failed should be(false)

    SafeLogger.warn(outState.right.get.requestInfo.messages.head)
  }

  it should "match a transaction declined error" in {
    val errorResponse = Some(ZuoraErrorResponse(success = false, decode[List[ZuoraError]](Fixtures.zuoraErrorResponse).right.get))

    errorResponse match {
      case Some(ZuoraErrorResponse(_, List(ZuoraError("TRANSACTION_FAILED", _)))) => succeed
      case _ => fail()
    }
  }

  it should "convert a transaction declined error from Zuora to an appropriate CheckoutFailureReason" in {
    val failureHandler = new FailureHandler()
    val reason = failureHandler.toCheckoutFailureReason(ZuoraError("TRANSACTION_FAILED", "Transaction declined.do_not_honor - Your card was declined."))
    reason should be(PaymentMethodUnacceptable)
  }

}
