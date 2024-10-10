package services

import cats.data.EitherT
import com.amazonaws.services.sqs.AmazonSQSAsync
import com.amazonaws.services.sqs.model.{GetQueueUrlResult, SendMessageResult}
import com.paypal.api.payments.{Amount, Payer, PayerInfo, Payment, Transaction}
import model.{DefaultThreadPool, PaymentProvider}
import org.mockito.Mockito._
import org.mockito.ArgumentMatchers.any
import org.scalatest.concurrent.ScalaFutures

import java.util.concurrent.CompletableFuture
import model.email.ContributorRow
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar

import java.util
import scala.compat.java8.FutureConverters._
import scala.concurrent.Future
import scala.jdk.CollectionConverters._
import scala.concurrent.ExecutionContext

class EmailServiceSpec extends AnyFlatSpec with Matchers with MockitoSugar with ScalaFutures {

  behavior of "Email Service"

  trait EmailServiceTestFixture {
    implicit val executionContextTest: DefaultThreadPool = DefaultThreadPool(ExecutionContext.global)
    val sqsClient: AmazonSQSAsync = mock[AmazonSQSAsync]
    val getQueueUrlResult: GetQueueUrlResult = mock[GetQueueUrlResult]
    when(getQueueUrlResult.getQueueUrl).thenReturn("test-queue-name")
    when(sqsClient.getQueueUrl("test-queue-name")).thenReturn(getQueueUrlResult)
    val emailService: EmailService = new EmailService(sqsClient, "test-queue-name")
  }

  it should "send an email" in new EmailServiceTestFixture {
    val payment: Payment = mock[Payment]
    val amount: Amount = mock[Amount]
    val payer: Payer = mock[Payer]
    val payerInfo: PayerInfo = mock[PayerInfo]
    val transaction: Transaction = mock[com.paypal.api.payments.Transaction]
    val transactions: util.List[Transaction] = List(transaction).asJava
    when(transaction.getAmount).thenReturn(amount)
    when(amount.getCurrency).thenReturn("GBP")
    when(amount.getTotal).thenReturn("2")
    when(payerInfo.getCountryCode).thenReturn("uk")
    when(payerInfo.getEmail).thenReturn("email@email.com")
    when(payer.getPayerInfo).thenReturn(payerInfo)
    when(payment.getPayer).thenReturn(payer)
    when(payment.getTransactions).thenReturn(transactions)
    when(payment.getCreateTime).thenReturn("01-01-2018T12:12:12")

    val scalaFuture: Future[SendMessageResult] = Future.successful(new SendMessageResult)
    val javaFuture: CompletableFuture[SendMessageResult] = scalaFuture.toJava.toCompletableFuture

    when(sqsClient.sendMessageAsync(any())).thenReturn(javaFuture)

    val emailResult: EitherT[Future, EmailService.Error, SendMessageResult] = emailService.sendThankYouEmail(
      ContributorRow("email@email.com", "GBP", "1", PaymentProvider.Paypal, None, BigDecimal(2)),
    )
    whenReady(emailResult.value) { result =>
      result mustBe Right(new SendMessageResult)
    }
  }

  it should "return an error if the sqs client throws an exception" in new EmailServiceTestFixture {
    val payment: Payment = mock[Payment]
    val amount: Amount = mock[Amount]
    val payer: Payer = mock[Payer]
    val payerInfo: PayerInfo = mock[PayerInfo]
    val transaction: Transaction = mock[com.paypal.api.payments.Transaction]
    val transactions: util.List[Transaction] = List(transaction).asJava
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
    val scalaFuture: Future[SendMessageResult] = Future.failed[SendMessageResult](exception)
    val javaFuture: CompletableFuture[SendMessageResult] = scalaFuture.toJava.toCompletableFuture

    when(sqsClient.sendMessageAsync(any())).thenReturn(javaFuture)

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
        _ => fail(),
      )
    }
  }

}
