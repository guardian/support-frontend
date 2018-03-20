package services

import com.paypal.api.payments.{Transaction, _}
import conf.PaypalConfig
import model.{Currency, PaypalThreadPool}
import model.paypal.{CreatePaypalPaymentData, PaypalApiError, PaypalMode}
import org.mockito.Mockito._
import org.scalatest.PrivateMethodTester._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.concurrent.ScalaFutures

import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext

class PaypalServiceSpec extends FlatSpec with Matchers with MockitoSugar with ScalaFutures {

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
    transactionList.size() should be (1)
    val transaction:Transaction = transactionList.asScala.head
    transaction.getAmount.getCurrency should be ("GBP")
    transaction.getAmount.getTotal should be ("50.00")
    transaction.getDescription should be ("Contribution to the guardian")
    transaction.getItemList.getItems.asScala.head.getDescription should be ("Contribution to the guardian")
    transaction.getItemList.getItems.asScala.head.getQuantity should be ("1")
    transaction.getItemList.getItems.asScala.head.getPrice should be ("50.00")
    transaction.getItemList.getItems.asScala.head.getCurrency should be ("GBP")
  }

  it should "build capture by transaction" in new PaypalServiceTestFixture {
    val transactionList = paypalService invokePrivate buildPaypalTransactions("GBP", BigDecimal(50))
    val capture = paypalService invokePrivate buildCaptureByTransaction(transactionList.asScala.head)
    capture.getAmount.getCurrency should be ("GBP")
    capture.getAmount.getTotal should be ("50.00")
    capture.getIsFinalCapture shouldBe(true)
  }

  it should "return valid transaction if the payment data is correct" in new PaypalServiceTestFixture {
    val transactionList = List[Transaction](mock[Transaction]).asJava
    val payment = mock[Payment]
    when(payment.getTransactions).thenReturn(transactionList)
    val transactionResult = paypalService invokePrivate getTransaction(payment)
    transactionResult.isRight shouldBe(true)
  }

  it should "return an error if the payment data is invalid" in new PaypalServiceTestFixture {
    val transactionList = List[Transaction]().asJava
    val payment = mock[Payment]
    when(payment.getTransactions).thenReturn(transactionList)
    val transactionResult = paypalService invokePrivate getTransaction(payment)
    transactionResult.isRight shouldBe(false)
  }

  it should "return valid related resources if the transaction data is correct" in new PaypalServiceTestFixture {
    val relatedResourcesList = List[RelatedResources](mock[RelatedResources]).asJava
    val transaction = mock[Transaction]
    when(transaction.getRelatedResources).thenReturn(relatedResourcesList)
    val relatedResourcesResult = paypalService invokePrivate getRelatedResources(transaction)
    relatedResourcesResult.isRight shouldBe(true)
  }

  it should "return an error if the transaction data is invalid" in new PaypalServiceTestFixture {
    val relatedResourcesList = List[RelatedResources]().asJava
    val transaction = mock[Transaction]
    when(transaction.getRelatedResources).thenReturn(relatedResourcesList)
    val relatedResourcesResult = paypalService invokePrivate getRelatedResources(transaction)
    relatedResourcesResult.isRight shouldBe(false)
  }

  it should "validate if the capture status is completed" in new PaypalServiceTestFixture {
    val capture = mock[Capture]
    when(capture.getState).thenReturn("COMPLETED")
    val validateResult = paypalService invokePrivate validateCapture(capture)
    validateResult.isRight shouldBe(true)
  }

  it should "validate if the capture status is not completed" in new PaypalServiceTestFixture {
    val capture = mock[Capture]
    when(capture.getState).thenReturn("PAYMENT_NOT_APPROVED")
    val validateResult = paypalService invokePrivate validateCapture(capture)
    validateResult.isRight shouldBe(false)
  }

  it should "validate if the payment status is approved" in new PaypalServiceTestFixture {
    val payment = mock[Payment]
    when(payment.getState).thenReturn("APPROVED")
    val validateResult = paypalService invokePrivate validatePayment(payment)
    validateResult.isRight shouldBe(true)
  }

  it should "validate if the payment status is not approved" in new PaypalServiceTestFixture {
    val payment = mock[Payment]
    when(payment.getState).thenReturn("PAYMENT_NOT_APPROVED_FOR_EXECUTION")
    val validateResult = paypalService invokePrivate validatePayment(payment)
    validateResult.isRight shouldBe(false)
  }

  it should "validate if the payment amount exceed Australia max" in new PaypalServiceTestFixture {
    val createPaypalPaymentData = CreatePaypalPaymentData(Currency.AUD, BigDecimal(16001), "url", "url")
    whenReady(paypalService.createPayment(createPaypalPaymentData).value){ result =>
      result shouldBe(Left(PaypalApiError.fromString("Amount exceeds the maximum allowed ")))
    }
  }

  it should "validate if the payment amount exceed non Australia max" in new PaypalServiceTestFixture {
    val createPaypalPaymentData = CreatePaypalPaymentData(Currency.GBP, BigDecimal(2001), "url", "url")
    whenReady(paypalService.createPayment(createPaypalPaymentData).value){ result =>
      result shouldBe(Left(PaypalApiError.fromString("Amount exceeds the maximum allowed ")))
    }
  }

}