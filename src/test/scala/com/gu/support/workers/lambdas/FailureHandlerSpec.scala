package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.emailservices.{EmailService, FailedContributionEmailFields, FailedDigitalPackEmailFields, IdentityUserId}
import com.gu.monitoring.SafeLogger
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.CheckoutFailureReasons.{PaymentMethodUnacceptable, Unknown}
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.states.CheckoutFailureState
import com.gu.support.workers.{Fixtures, LambdaSpec}
import com.gu.support.zuora.api.response.{ZuoraError, ZuoraErrorResponse}
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.generic.auto._
import io.circe.parser.decode
import org.mockito.Matchers.any
import org.mockito.Mockito.{times, verify, when}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@IntegrationTest
class FailureHandlerSpec extends LambdaSpec {

  ignore should "send a failure email" in {
    //This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService
    val email = "rupert.bates@theguardian.com"
    service
      .send(FailedContributionEmailFields(email, IdentityUserId("identityId")))
      .map(result => result.getMessageId should not be "")
  }

  "FailureHandler lambda" should "return a failed JsonWrapper and an Unknown failure reason for any errors except payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(failureJson.asInputStream, outStream, context)

    val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
    val requestInfo = outState.get._3
    val checkoutFailureState = outState.get._1

    requestInfo.failed should be(true)
    checkoutFailureState.checkoutFailureReason should be(Unknown)

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for a payment error from Zuora" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonZuora.asInputStream, outStream, context)

    val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
    val requestInfo = outState.get._3
    val checkoutFailureState = outState.get._1

    SafeLogger.info(requestInfo.messages.head)

    requestInfo.failed should be(false)
    checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for Stripe payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(cardDeclinedJsonStripe.asInputStream, outStream, context)

    val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
    val requestInfo = outState.get._3
    val checkoutFailureState = outState.get._1

    SafeLogger.info(requestInfo.messages.head)

    requestInfo.failed should be(false)
    checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for Stripe payment errors for a digital pack, too" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(digipackCardDeclinedStripeJson.asInputStream, outStream, context)

    val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
    val requestInfo = outState.get._3
    val checkoutFailureState = outState.get._1

    SafeLogger.warn(requestInfo.messages.head)

    requestInfo.failed should be(false)
    checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)

  }

  it should "send an email with FailedDigitalPackEmailFields when there are Stripe payment errors " in {

    val emailService = mock[EmailService]
    val result = mock[SendMessageResult]

    val testFields = FailedDigitalPackEmailFields("test@gu.com", IdentityUserId("30001643"))

    when(emailService.send(any[FailedDigitalPackEmailFields])).thenReturn(Future.successful(result))

    val failureHandler = new FailureHandler(emailService)

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequest(digipackCardDeclinedStripeJson.asInputStream, outStream, context)

    verify(emailService, times(1)).send(testFields)

    val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
    val requestInfo = outState.get._3

    SafeLogger.warn(requestInfo.messages.head)

    requestInfo.failed should be(false)
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
