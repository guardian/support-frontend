package services

import com.amazonaws.services.sqs.AmazonSQSAsync
import com.amazonaws.services.sqs.model.{GetQueueUrlResult, SendMessageResult}
import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment}
import model.DefaultThreadPool
import org.scalatest.Matchers
import org.mockito.Matchers._
import org.mockito.Mockito._
import org.scalatest.FlatSpec
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.mockito.MockitoSugar
import java.util.concurrent.CompletableFuture
import scala.compat.java8.FutureConverters._
import scala.concurrent.Future
import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext

class EmailServiceSpec extends FlatSpec with Matchers with MockitoSugar with ScalaFutures {

  behavior of "Email Service"

  trait EmailServiceTestFixture {
    implicit val executionContextTest = DefaultThreadPool(ExecutionContext.global)
    val sqsClient = mock[AmazonSQSAsync]
    val getQueueUrlResult = mock[GetQueueUrlResult]
    when(getQueueUrlResult.getQueueUrl()).thenReturn("test-queue-name")
    when(sqsClient.getQueueUrl("test-queue-name")).thenReturn(getQueueUrlResult)
    val emailService = new EmailService(sqsClient, "test-queue-name")
  }

  it should "send an email" in new EmailServiceTestFixture {
    val payment = mock[Payment]
    val amount = mock[Amount]
    val payer = mock[Payer]
    val payerInfo = mock[PayerInfo]
    val transaction = mock[com.paypal.api.payments.Transaction]
    val transactions = List(transaction).asJava
    val identityId = 666l
    when(transaction.getAmount).thenReturn(amount)
    when(amount.getCurrency).thenReturn("GBP")
    when(amount.getTotal).thenReturn("2")
    when(payerInfo.getCountryCode).thenReturn("uk")
    when(payerInfo.getEmail).thenReturn("email@email.com")
    when(payer.getPayerInfo).thenReturn(payerInfo)
    when(payment.getPayer).thenReturn(payer)
    when(payment.getTransactions).thenReturn(transactions)
    when(payment.getCreateTime).thenReturn("01-01-2018T12:12:12")

    val scalaFuture = Future.successful(new SendMessageResult)
    val javaFuture: CompletableFuture[SendMessageResult] = scalaFuture.toJava.toCompletableFuture

    when(sqsClient.sendMessageAsync(any())).thenReturn(javaFuture)

    val emailResult = emailService.sendThankYouEmail("email@email.com", "GBP", identityId)
    whenReady(emailResult.value) { result =>
      result shouldBe Right(new SendMessageResult)
    }
  }

  it should "return an error if the sqs client throws an exception" in new EmailServiceTestFixture {
    val payment = mock[Payment]
    val amount = mock[Amount]
    val payer = mock[Payer]
    val payerInfo = mock[PayerInfo]
    val transaction = mock[com.paypal.api.payments.Transaction]
    val transactions = List(transaction).asJava
    val identityId = 666l
    when(transaction.getAmount).thenReturn(amount)
    when(amount.getCurrency).thenReturn("GBP")
    when(amount.getTotal).thenReturn("2")
    when(payerInfo.getCountryCode).thenReturn("uk")
    when(payerInfo.getEmail).thenReturn("email@email.com")
    when(payer.getPayerInfo).thenReturn(payerInfo)
    when(payment.getPayer).thenReturn(payer)
    when(payment.getTransactions).thenReturn(transactions)
    when(payment.getCreateTime).thenReturn("01-01-2018T12:12:12")

    val errorString = "Any sqs client error"
    val exception = new Exception(errorString)
    val emailError = EmailService.Error(exception)
    val scalaFuture = Future.failed[SendMessageResult](exception)
    val javaFuture: CompletableFuture[SendMessageResult] = scalaFuture.toJava.toCompletableFuture

    when(sqsClient.sendMessageAsync(any())).thenReturn(javaFuture)

    whenReady(emailService.sendThankYouEmail("email@email.com", "GBP", identityId).value) { result =>
      result.fold(
        error => {
          // TODO: understand how this java.lang.Exception bit gets added
          error.getMessage shouldBe s"java.lang.Exception: $errorString"
        },
        success => fail
      )
    }
  }

}
