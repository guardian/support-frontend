package services

import com.paypal.api.payments.{Transaction, _}
import conf.PaypalConfig
import model.PaypalThreadPool
import model.paypal.{PaypalApiError, PaypalMode}
import org.mockito.Mockito
import org.scalatest.PrivateMethodTester._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext

class PaypalServiceSpec extends FlatSpec with Matchers with MockitoSugar {

  trait PaypalServiceTestFixture {
    val paypalConfig = PaypalConfig("clientIdTest", "clientSecretTest", PaypalMode.Sandbox)
    implicit val executionContextTest = PaypalThreadPool(ExecutionContext.global)
    val buildPaypalTransactions = PrivateMethod[java.util.List[Transaction]]('buildPaypalTransactions)
    val buildCaptureByTransaction = PrivateMethod[Capture]('buildCaptureByTransaction)
    val getTransaction = PrivateMethod[Either[PaypalApiError, Transaction]]('getTransaction)
    val getRelatedResources = PrivateMethod[Either[PaypalApiError, RelatedResources]]('getRelatedResources)
    val validateCapture = PrivateMethod[Either[PaypalApiError, Capture]]('validateCapture)
    val validateExecute = PrivateMethod[Either[PaypalApiError, Payment]]('validateExecute)
    val paypalService = new PaypalService(paypalConfig)
  }

  behavior of "Paypal Service"

  it should "build paypal transactions successfully" in new PaypalServiceTestFixture {
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

  it should "get transaction by payment - success" in new PaypalServiceTestFixture {
    val transactionList = List[Transaction](mock[Transaction]).asJava
    val payment = mock[Payment]
    Mockito.when(payment.getTransactions).thenReturn(transactionList)
    val transactionResult = paypalService invokePrivate getTransaction(payment)
    transactionResult.isRight shouldBe(true)
  }

  it should "get transaction by payment - failure" in new PaypalServiceTestFixture {
    val transactionList = List[Transaction]().asJava
    val payment = mock[Payment]
    Mockito.when(payment.getTransactions).thenReturn(transactionList)
    val transactionResult = paypalService invokePrivate getTransaction(payment)
    transactionResult.isRight shouldBe(false)
  }

  it should "get related resources by transaction - success" in new PaypalServiceTestFixture {
    val relatedResourcesList = List[RelatedResources](mock[RelatedResources]).asJava
    val transaction = mock[Transaction]
    Mockito.when(transaction.getRelatedResources).thenReturn(relatedResourcesList)
    val relatedResourcesResult = paypalService invokePrivate getRelatedResources(transaction)
    relatedResourcesResult.isRight shouldBe(true)
  }

  it should "get related resources by transaction - failure" in new PaypalServiceTestFixture {
    val relatedResourcesList = List[RelatedResources]().asJava
    val transaction = mock[Transaction]
    Mockito.when(transaction.getRelatedResources).thenReturn(relatedResourcesList)
    val relatedResourcesResult = paypalService invokePrivate getRelatedResources(transaction)
    relatedResourcesResult.isRight shouldBe(false)
  }

  it should "validate capture - success" in new PaypalServiceTestFixture {
    val capture = mock[Capture]
    Mockito.when(capture.getState).thenReturn("COMPLETED")
    val validateResult = paypalService invokePrivate validateCapture(capture)
    validateResult.isRight shouldBe(true)
  }

  it should "validate capture - failure" in new PaypalServiceTestFixture {
    val capture = mock[Capture]
    Mockito.when(capture.getState).thenReturn("PAYMENT_NOT_APPROVED")
    val validateResult = paypalService invokePrivate validateCapture(capture)
    validateResult.isRight shouldBe(false)
  }

  it should "validate execute - success" in new PaypalServiceTestFixture {
    val payment = mock[Payment]
    Mockito.when(payment.getState).thenReturn("APPROVED")
    val validateResult = paypalService invokePrivate validateExecute(payment)
    validateResult.isRight shouldBe(true)
  }

  it should "validate execute - failure" in new PaypalServiceTestFixture {
    val payment = mock[Payment]
    Mockito.when(payment.getState).thenReturn("PAYMENT_NOT_APPROVED_FOR_EXECUTION")
    val validateResult = paypalService invokePrivate validateExecute(payment)
    validateResult.isRight shouldBe(false)
  }

}