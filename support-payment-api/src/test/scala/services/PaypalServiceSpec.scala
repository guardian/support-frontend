package services

import com.paypal.api.payments.{Transaction, _}
import conf.PaypalConfig
import model.{Currency, PaypalThreadPool}
import model.paypal.{CreatePaypalPaymentData, PaypalApiError, PaypalMode}
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar

import scala.jdk.CollectionConverters._
import scala.concurrent.ExecutionContext

class PaypalServiceSpec extends AnyFlatSpec with Matchers with MockitoSugar with ScalaFutures {

  trait PaypalServiceTestFixture {
    val paypalConfig = PaypalConfig("clientIdTest", "clientSecretTest", "hookId", PaypalMode.Sandbox)
    implicit val executionContextTest = PaypalThreadPool(ExecutionContext.global)
    val buildPaypalTransactions = PrivateMethod[java.util.List[Transaction]]('buildPaypalTransactions)
    val buildCaptureByTransaction = PrivateMethod[Capture]('buildCaptureByTransaction)
    val getTransaction = PrivateMethod[Either[PaypalApiError, Transaction]]('getTransaction)
    val getRelatedResources = PrivateMethod[Either[PaypalApiError, RelatedResources]]('getRelatedResources)
    val validateCapture = PrivateMethod[Either[PaypalApiError, Capture]]('validateCapture)
    val validatePayment = PrivateMethod[Either[PaypalApiError, Payment]]('validatePayment)
    val paypalService = new PaypalService(paypalConfig)
  }

  behavior of "Paypal Service"

  it should "build paypal transactions" in new PaypalServiceTestFixture {
    val transactionList = paypalService invokePrivate buildPaypalTransactions("GBP", BigDecimal(50))
    transactionList.size() mustBe (1)
    val transaction: Transaction = transactionList.asScala.head
    transaction.getAmount.getCurrency mustBe ("GBP")
    transaction.getAmount.getTotal mustBe ("50.00")
    transaction.getDescription mustBe ("Contribution to the guardian")
    transaction.getItemList.getItems.asScala.head.getDescription mustBe ("Contribution to the guardian")
    transaction.getItemList.getItems.asScala.head.getQuantity mustBe ("1")
    transaction.getItemList.getItems.asScala.head.getPrice mustBe ("50.00")
    transaction.getItemList.getItems.asScala.head.getCurrency mustBe ("GBP")
  }

  it should "build capture by transaction" in new PaypalServiceTestFixture {
    val transactionList = paypalService invokePrivate buildPaypalTransactions("GBP", BigDecimal(50))
    val capture = paypalService invokePrivate buildCaptureByTransaction(transactionList.asScala.head)
    capture.getAmount.getCurrency mustBe ("GBP")
    capture.getAmount.getTotal mustBe ("50.00")
    capture.getIsFinalCapture mustBe (true)
  }

  it should "return valid transaction if the payment data is correct" in new PaypalServiceTestFixture {
    val transactionList = List[Transaction](mock[Transaction]).asJava
    val payment = mock[Payment]
    when(payment.getTransactions).thenReturn(transactionList)
    val transactionResult = paypalService invokePrivate getTransaction(payment)
    transactionResult.isRight mustBe (true)
  }

  it should "return an error if the payment data is invalid" in new PaypalServiceTestFixture {
    val transactionList = List[Transaction]().asJava
    val payment = mock[Payment]
    when(payment.getTransactions).thenReturn(transactionList)
    val transactionResult = paypalService invokePrivate getTransaction(payment)
    transactionResult.isRight mustBe (false)
  }

  it should "return valid related resources if the transaction data is correct" in new PaypalServiceTestFixture {
    val relatedResourcesList = List[RelatedResources](mock[RelatedResources]).asJava
    val transaction = mock[Transaction]
    when(transaction.getRelatedResources).thenReturn(relatedResourcesList)
    val relatedResourcesResult = paypalService invokePrivate getRelatedResources(transaction)
    relatedResourcesResult.isRight mustBe (true)
  }

  it should "return an error if the transaction data is invalid" in new PaypalServiceTestFixture {
    val relatedResourcesList = List[RelatedResources]().asJava
    val transaction = mock[Transaction]
    when(transaction.getRelatedResources).thenReturn(relatedResourcesList)
    val relatedResourcesResult = paypalService invokePrivate getRelatedResources(transaction)
    relatedResourcesResult.isRight mustBe (false)
  }

  it should "return success if the capture status is completed" in new PaypalServiceTestFixture {
    val capture = mock[Capture]
    when(capture.getState).thenReturn("COMPLETED")
    val validateResult = paypalService invokePrivate validateCapture(capture)
    validateResult.isRight mustBe (true)
  }

  it should "return an error if the capture status is not completed" in new PaypalServiceTestFixture {
    val capture = mock[Capture]
    when(capture.getState).thenReturn("PAYMENT_NOT_APPROVED")
    val validateResult = paypalService invokePrivate validateCapture(capture)
    validateResult.isRight mustBe (false)
  }

  it should "return success if the payment status is approved" in new PaypalServiceTestFixture {
    val payment = mock[Payment]
    when(payment.getState).thenReturn("APPROVED")
    val validateResult = paypalService invokePrivate validatePayment(payment)
    validateResult.isRight mustBe (true)
  }

  it should "return an error if the payment status is not approved" in new PaypalServiceTestFixture {
    val payment = mock[Payment]
    when(payment.getState).thenReturn("PAYMENT_NOT_APPROVED_FOR_EXECUTION")
    val validateResult = paypalService invokePrivate validatePayment(payment)
    validateResult.isRight mustBe (false)
  }

  it should "return an error if the payment amount exceeds Australia max" in new PaypalServiceTestFixture {
    val createPaypalPaymentData = CreatePaypalPaymentData(Currency.AUD, 16000.50, "url", "url")
    whenReady(paypalService.createPayment(createPaypalPaymentData).value) { result =>
      result mustBe (Left(PaypalApiError.fromString("Amount exceeds the maximum allowed ")))
    }
  }

  it should "return an error if the payment amount exceeds non-Australia max" in new PaypalServiceTestFixture {
    val createPaypalPaymentData = CreatePaypalPaymentData(Currency.GBP, 2000.50, "url", "url")
    whenReady(paypalService.createPayment(createPaypalPaymentData).value) { result =>
      result mustBe (Left(PaypalApiError.fromString("Amount exceeds the maximum allowed ")))
    }
  }

}
