package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.CheckoutFailureReasons.{
  AccountMismatch,
  AmazonPayTryAnotherCard,
  PaymentMethodUnacceptable,
  Unknown,
}
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.states.CheckoutFailureState
import com.gu.support.workers._
import com.gu.support.zuora.api.response.{ZuoraError, ZuoraErrorResponse}
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.parser.decode
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.{times, verify, when}
import org.scalatest.matchers.should.Matchers

import scala.concurrent.{ExecutionContext, Future}

@IntegrationTest
class FailureHandlerITSpec extends AsyncLambdaSpec with MockContext {

  "FailureHandler lambda" should "return a failed JsonWrapper and an Unknown failure reason for any errors except payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(failureJson.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      requestInfo.failed should be(true)
      checkoutFailureState.checkoutFailureReason should be(Unknown)
    }

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for a payment error from Zuora" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(cardDeclinedJsonZuora.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      SafeLogger.info(requestInfo.messages.head)

      requestInfo.failed should be(false)
      checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)
    }

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for Stripe payment errors" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(cardDeclinedJsonStripe.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      SafeLogger.info(requestInfo.messages.head)

      requestInfo.failed should be(false)
      checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)
    }

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for Stripe payment errors for a digital pack, too" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(digipackCardDeclinedStripeJson.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      SafeLogger.warn(requestInfo.messages.head)

      requestInfo.failed should be(false)
      checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)
    }

  }

  it should "return a non failed JsonWrapper if we encounter the error caused by using a test token in PROD" in {
    val failureHandler = new FailureHandler()

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(testTokenInProdJsonStripe.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      SafeLogger.info(requestInfo.messages.head)

      requestInfo.failed should be(false)
      checkoutFailureState.checkoutFailureReason should be(AccountMismatch)
    }
  }

  it should "send an email with FailedDigitalPackEmailFields when there are Stripe payment errors " in {

    val emailService = mock[EmailService]
    val result = mock[SendMessageResult]

    val testFields = FailedEmailFields.digitalPack("test@thegulocal.com", IdentityUserId("30001643"))

    when(emailService.send(any[EmailFields])).thenReturn(Future.successful(result))

    val failureHandler = new FailureHandler(emailService)

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(digipackCardDeclinedStripeJson.asInputStream, outStream, context).map { _ =>
      verify(emailService, times(1)).send(testFields)

      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3

      SafeLogger.warn(requestInfo.messages.head)

      requestInfo.failed should be(false)
    }
  }

}

class FailureHandlerSpec extends AsyncLambdaSpec with MockContext {

  it should "match a transaction declined error" in {
    val errorResponse =
      Some(ZuoraErrorResponse(success = false, decode[List[ZuoraError]](JsonFixtures.zuoraErrorResponse).toOption.get))

    errorResponse match {
      case Some(ZuoraErrorResponse(_, List(ZuoraError("TRANSACTION_FAILED", _)))) => succeed
      case _ => fail()
    }
  }

  it should "convert a transaction declined error from Zuora to an appropriate CheckoutFailureReason" in {
    val reason = FailureHandler.toCheckoutFailureReason(
      ZuoraError("TRANSACTION_FAILED", "Transaction declined.do_not_honor - Your card was declined."),
      Stripe,
    )
    reason should be(PaymentMethodUnacceptable)
  }

  it should "convert an Amazon Pay transaction declined error from Zuora to an appropriate CheckoutFailureReason" in {
    val reason = FailureHandler.toCheckoutFailureReason(
      ZuoraError("TRANSACTION_FAILED", "Transaction declined.InvalidPaymentMethod - Declined"),
      AmazonPay,
    )
    reason should be(AmazonPayTryAnotherCard)
  }

}

object FailureHandlerManualTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(Configuration.load().contributionThanksQueueName)
    val email = "rupert.bates@theguardian.com"
    service
      .send(FailedEmailFields.contribution(email, IdentityUserId("identityId")))
      .map(result => result.getMessageId should not be "")
  }

}

object DigiPackFailureHandlerManualTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(Configuration.load().contributionThanksQueueName)
    val email = "flavian.alexandru.freelancer@guardian.co.uk"
    service
      .send(FailedEmailFields.digitalPack(email, IdentityUserId("identityId")))
      .map { result =>
        result.getMessageId should not be ""
        sys.exit(0)
      }
  }
}

object GuardianWeeklyFailureHandlerTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(Configuration.load().contributionThanksQueueName)
    val email = "flavian.alexandru.freelancer@guardian.co.uk"
    service
      .send(FailedEmailFields.guardianWeekly(email, IdentityUserId("identityId")))
      .map { result =>
        result.getMessageId should not be ""
        sys.exit(0)
      }
  }
}

object PrintFailureHandlerTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(Configuration.load().contributionThanksQueueName)
    val email = "flavian.alexandru.freelancer@guardian.co.uk"
    service
      .send(FailedEmailFields.paper(email, IdentityUserId("identityId")))
      .map { result =>
        result.getMessageId should not be ""
        sys.exit(0)
      }
  }
}
