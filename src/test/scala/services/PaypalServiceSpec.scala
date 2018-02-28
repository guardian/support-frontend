package services

import cats.data.EitherT
import com.paypal.api.payments.{Capture, Item, Transaction}
import conf.PaypalConfig
import model.{Currency, PaypalThreadPool}
import model.paypal.{CreatePaypalPaymentData, PaypalApiError, PaypalMode}
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.{FlatSpec, Matchers}

import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future}

class PaypalServiceSpec extends FlatSpec with Matchers with ScalaFutures {

  trait PaypalServiceTestFixture {
    val paypalConfig = PaypalConfig("clientIdTest", "clientSecretTest", PaypalMode.Sandbox)
    implicit val executionContextTest = PaypalThreadPool(ExecutionContext.global)
    val buildPaypalTransactions = PrivateMethod[java.util.List[Transaction]]('buildPaypalTransactions)
    val buildCaptureByTransaction = PrivateMethod[Capture]('buildCaptureByTransaction)
    val asyncExecute = PrivateMethod[EitherT[Future, PaypalApiError, Int]]('asyncExecute)
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


}