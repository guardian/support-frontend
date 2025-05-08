package com.gu.support.workers.lambdas

import com.gu.emailservices._
import com.gu.support.workers.CheckoutFailureReasons.{AccountMismatch, PaymentMethodUnacceptable, Unknown}
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.states.CheckoutFailureState
import com.gu.support.workers._
import com.gu.support.workers.integration.util.EmailQueueName
import com.gu.support.workers.integration.util.EmailQueueName.emailQueueName
import com.gu.support.zuora.api.response.{ZuoraError, ZuoraErrorResponse}
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.parser.decode
import org.mockito.ArgumentMatchers.any
import org.scalatest.matchers.should.Matchers

import java.io.ByteArrayOutputStream
import scala.concurrent.{ExecutionContext, Future}

@IntegrationTest
class FailureHandlerITSpec extends AsyncLambdaSpec with MockContext {
  "FailureHandler lambda" should "return a failed JsonWrapper and an Unknown failure reason for any errors except payment errors" in {
    val failureHandler = new FailureHandler(emailService = new EmailService(emailQueueName))

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
    val failureHandler = new FailureHandler(new EmailService(emailQueueName))

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(cardDeclinedJsonZuora.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      withClue(requestInfo.messages.head) {
        requestInfo.failed should be(false)
        checkoutFailureState.checkoutFailureReason should be(Unknown)
      }
    }

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for Stripe payment errors" in {
    val failureHandler = new FailureHandler(new EmailService(emailQueueName))

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(cardDeclinedJsonStripe.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      withClue(requestInfo.messages.head) {
        requestInfo.failed should be(false)
        checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)
      }
    }

  }

  it should "return a non failed JsonWrapper and an appropriate failure reason for Stripe payment errors for a digital pack, too" in {
    val failureHandler = new FailureHandler(new EmailService(emailQueueName))

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(digipackCardDeclinedStripeJson.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      withClue(requestInfo.messages.head) {
        requestInfo.failed should be(false)
        checkoutFailureState.checkoutFailureReason should be(PaymentMethodUnacceptable)
      }
    }

  }

  it should "return a non failed JsonWrapper if we encounter the error caused by using a test token in PROD" in {
    val failureHandler = new FailureHandler(new EmailService(emailQueueName))

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(testTokenInProdJsonStripe.asInputStream, outStream, context).map { _ =>
      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3
      val checkoutFailureState = outState.get._1

      withClue(requestInfo.messages.head) {
        requestInfo.failed should be(false)
        checkoutFailureState.checkoutFailureReason should be(AccountMismatch)
      }
    }
  }

  it should "send an email with FailedDigitalPackEmailFields when there are Stripe payment errors " in {
    val emailService = mock[EmailService]

    val testFields = FailedEmailFields.digitalPack("test@thegulocal.com", IdentityUserId("30001643"))

    val failureHandler = new FailureHandler(emailService)

    val outStream = new ByteArrayOutputStream()

    failureHandler.handleRequestFuture(digipackCardDeclinedStripeJson.asInputStream, outStream, context).map { _ =>
      verify(emailService, times(1)).send(testFields)

      val outState = Encoding.in[CheckoutFailureState](outStream.toInputStream)
      val requestInfo = outState.get._3

      withClue(requestInfo.messages.head) {
        requestInfo.failed should be(false)
      }
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

}

object FailureHandlerManualTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(emailQueueName)
    val email = "rupert.bates@theguardian.com"
    service
      .send(FailedEmailFields.contribution(email, IdentityUserId("identityId")))
  }

}

object DigiPackFailureHandlerManualTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(emailQueueName)
    val email = "flavian.alexandru.freelancer@guardian.co.uk"
    service
      .send(FailedEmailFields.digitalPack(email, IdentityUserId("identityId")))
  }
}

object GuardianWeeklyFailureHandlerTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(emailQueueName)
    val email = "flavian.alexandru.freelancer@guardian.co.uk"
    service
      .send(FailedEmailFields.guardianWeekly(email, IdentityUserId("identityId")))
  }
}

object PrintFailureHandlerTest extends Matchers {

  implicit val ex: ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  def main(args: Array[String]): Unit = {
    sendFailureEmail()
  }

  def sendFailureEmail(): Unit = {
    // This test will send a failure email to the address below - useful for quickly testing changes
    val service = new EmailService(emailQueueName)
    val email = "flavian.alexandru.freelancer@guardian.co.uk"
    service
      .send(FailedEmailFields.paper(email, IdentityUserId("identityId")))
  }
}
