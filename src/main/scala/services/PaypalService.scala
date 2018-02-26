package services

import java.util.UUID

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.paypal.api.payments._
import com.paypal.base.rest.APIContext
import com.typesafe.scalalogging.StrictLogging
import conf.PaypalConfig
import model.paypal.{CreatePaypalPaymentData, PaypalApiError}
import model.{InitializationResult, PaypalThreadPool}

import scala.concurrent.Future
import scala.math.BigDecimal.RoundingMode

object PaypalContext {
  val Intent = "sale"
  val PaymentMethod = "paypal"
  val Description = "Contribution to the guardian"
}

trait Paypal {
  type PaypalResult[A] = EitherT[Future, PaypalApiError, A]
  def createPayment(createPaypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment]
}


class PaypalService(config: PaypalConfig)(implicit pool: PaypalThreadPool) extends Paypal with StrictLogging {

  import PaypalContext._

  def createPayment(createPaypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment] = {

    val apiContext: APIContext = new APIContext(config.clientId, config.clientSecret, config.paypalMode.entryName)

    val payer = new Payer().setPaymentMethod(PaymentMethod)

    val transactions = buildPaypalTransactions(
      createPaypalPaymentData.currency.entryName,
      createPaypalPaymentData.amount)

    val redirectUrls = new RedirectUrls()
      .setCancelUrl(createPaypalPaymentData.cancelURL)
      .setReturnUrl(createPaypalPaymentData.returnURL)

    val paypalPayment = new Payment()
      .setIntent(Intent)
      .setPayer(payer)
      .setTransactions(transactions)
      .setRedirectUrls(redirectUrls)

    Future(paypalPayment.create(apiContext))
      .attemptT
      .bimap(
        err => {
          logger.error("unable to create paypal payment", err)
          PaypalApiError.fromThrowable(err)
        },
        payment => {
          logger.info("paypal payment created")
          payment
        }
      )
  }

  private def buildPaypalTransactions(currencyCode: String, amount: BigDecimal): java.util.List[Transaction] = {
    import scala.collection.JavaConverters._

    val stringAmount = amount.setScale(2, RoundingMode.HALF_UP).toString

    val paypalAmount = new Amount()
      .setCurrency(currencyCode)
      .setTotal(stringAmount)

    val item = new Item()
      .setDescription(Description)
      .setCurrency(currencyCode)
      .setPrice(stringAmount)
      .setQuantity("1")

    val itemList = new ItemList()
      .setItems(List(item).asJava)

    val transaction = new Transaction
    transaction.setAmount(paypalAmount)
    transaction.setDescription(Description)
    transaction.setCustom(UUID.randomUUID().toString)
    transaction.setItemList(itemList)

    List(transaction).asJava
  }

}

object PaypalService {
  def fromPaypalConfig(config: PaypalConfig)(implicit system: ActorSystem): InitializationResult[PaypalService] =
    PaypalThreadPool.load().map { implicit pool =>
      new PaypalService(config)
    }
}
