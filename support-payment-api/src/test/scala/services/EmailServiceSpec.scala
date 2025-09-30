package services

import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment}
import model.email.ContributorRow
import model.{DefaultThreadPool, PaymentProvider}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar
import software.amazon.awssdk.services.sqs.SqsAsyncClient
import software.amazon.awssdk.services.sqs.model.{
  GetQueueUrlRequest,
  GetQueueUrlResponse,
  SendMessageRequest,
  SendMessageResponse,
}

import java.util.concurrent.CompletableFuture
import scala.compat.java8.FutureConverters._
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._

class EmailServiceSpec extends AnyFlatSpec with Matchers with MockitoSugar with ScalaFutures {

  behavior of "Email Service"

  trait EmailServiceTestFixture {
    implicit val executionContextTest: DefaultThreadPool = DefaultThreadPool(ExecutionContext.global)
    val sqsClient = mock[SqsAsyncClient]
    val getQueueUrlResponse = GetQueueUrlResponse.builder().queueUrl("test-queue-name").build()
    when(sqsClient.getQueueUrl(any[GetQueueUrlRequest]()))
      .thenReturn(Future.successful(getQueueUrlResponse).toJava.toCompletableFuture)
    val emailService = new EmailService(sqsClient, "test-queue-name")
  }

  it should "send an email" in new EmailServiceTestFixture {
    val payment = mock[Payment]
    val amount = mock[Amount]
    val payer = mock[Payer]
    val payerInfo = mock[PayerInfo]
    val transaction = mock[com.paypal.api.payments.Transaction]
    val transactions = List(transaction).asJava
    val identityId = 666L
    when(transaction.getAmount).thenReturn(amount)
    when(amount.getCurrency).thenReturn("GBP")
    when(amount.getTotal).thenReturn("2")
    when(payerInfo.getCountryCode).thenReturn("uk")
    when(payerInfo.getEmail).thenReturn("email@email.com")
    when(payer.getPayerInfo).thenReturn(payerInfo)
    when(payment.getPayer).thenReturn(payer)
    when(payment.getTransactions).thenReturn(transactions)
    when(payment.getCreateTime).thenReturn("01-01-2018T12:12:12")

    val scalaFuture = Future.successful(SendMessageResponse.builder().build())
    val javaFuture: CompletableFuture[SendMessageResponse] = scalaFuture.toJava.toCompletableFuture

    when(sqsClient.sendMessage(any[SendMessageRequest]())).thenReturn(javaFuture)

    val emailResult = emailService.sendThankYouEmail(
      ContributorRow("email@email.com", "GBP", "1", PaymentProvider.Paypal, None, BigDecimal(2)),
    )
    whenReady(emailResult.value) { result =>
      result mustBe Right(SendMessageResponse.builder().build())
    }
  }

  it should "return an error if the sqs client throws an exception" in new EmailServiceTestFixture {
    val payment = mock[Payment]
    val amount = mock[Amount]
    val payer = mock[Payer]
    val payerInfo = mock[PayerInfo]
    val transaction = mock[com.paypal.api.payments.Transaction]
    val transactions = List(transaction).asJava
    val identityId = 666L
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
    val scalaFuture = Future.failed[SendMessageResponse](exception)
    val javaFuture: CompletableFuture[SendMessageResponse] = scalaFuture.toJava.toCompletableFuture

    when(sqsClient.sendMessage(any[SendMessageRequest]())).thenReturn(javaFuture)

    whenReady(
      emailService
        .sendThankYouEmail(ContributorRow("email@email.com", "GBP", "1", PaymentProvider.Paypal, None, BigDecimal(2)))
        .value,
    ) { result =>
      result.fold(
        error => {
          // TODO: understand how this java.lang.Exception bit gets added
          error.getMessage mustBe s"java.lang.Exception: $errorString"
        },
        success => fail,
      )
    }
  }

}
