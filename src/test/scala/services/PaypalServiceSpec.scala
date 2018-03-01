package services

import com.paypal.api.payments.{Item, Transaction}
import conf.PaypalConfig
import model.{Currency, PaypalThreadPool}
import model.paypal.{CreatePaypalPaymentData, PaypalMode}
import org.scalatest.PrivateMethodTester._
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.{FlatSpec, Matchers}

import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext

class PaypalServiceSpec extends FlatSpec with Matchers with ScalaFutures {

  trait PaypalServiceTestFixture {
    val paypalConfig = PaypalConfig("clientIdTest", "clientSecretTest", PaypalMode.Sandbox)
    implicit val executionContextTest = PaypalThreadPool(ExecutionContext.global)
    val buildPaypalTransactions = PrivateMethod[java.util.List[Transaction]]('buildPaypalTransactions)
    val paypalService = new PaypalService(paypalConfig)
  }

  behavior of "Paypal Service"

  it should "build paypal transactions successfully" in new PaypalServiceTestFixture {
    val result = paypalService invokePrivate buildPaypalTransactions("GBP", BigDecimal(50))
    result.size() should be (1)
    val transaction:Transaction = result.asScala.head
    transaction.getAmount.getCurrency should be ("GBP")
    transaction.getAmount.getTotal should be ("50.00")
    transaction.getDescription should be ("Contribution to the guardian")
    transaction.getItemList.getItems.asScala.head.getDescription should be ("Contribution to the guardian")
    transaction.getItemList.getItems.asScala.head.getQuantity should be ("1")
    transaction.getItemList.getItems.asScala.head.getPrice should be ("50.00")
    transaction.getItemList.getItems.asScala.head.getCurrency should be ("GBP")
  }

}