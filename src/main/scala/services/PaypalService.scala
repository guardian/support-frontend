package services

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.paypal.api.payments._
import com.paypal.base.Constants
import com.paypal.base.rest.APIContext
import com.typesafe.scalalogging.StrictLogging
import conf.PaypalConfig
import model.paypal._
import model.PaypalThreadPool

import scala.concurrent.Future
import scala.math.BigDecimal.RoundingMode
import scala.collection.JavaConverters._

trait Paypal {
  type PaypalResult[A] = EitherT[Future, PaypalApiError, A]
  def createPayment(createPaypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment]
  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData): PaypalResult[Payment]
  def executePayment(executePaymentData: ExecutePaypalPaymentData): PaypalResult[Payment]
  def validateEvent(headers: Map[String, String], body: String): PaypalResult[Unit]
}

class PaypalService(config: PaypalConfig)(implicit pool: PaypalThreadPool) extends Paypal with StrictLogging {

  val apiContext: APIContext = new APIContext(config.clientId, config.clientSecret, config.paypalMode.entryName)

  def createPayment(createPaypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment] = {

    val payer = new Payer().setPaymentMethod("paypal")

    val transactions = buildPaypalTransactions(
      createPaypalPaymentData.currency.entryName,
      createPaypalPaymentData.amount)

    val redirectUrls = new RedirectUrls()
      .setCancelUrl(createPaypalPaymentData.cancelURL)
      .setReturnUrl(createPaypalPaymentData.returnURL)

    val paypalPayment = new Payment()
      .setIntent("sale")
      .setPayer(payer)
      .setTransactions(transactions)
      .setRedirectUrls(redirectUrls)

    Either.catchNonFatal(paypalPayment.create(apiContext))
      .leftMap(PaypalApiError.fromThrowable)
      .toEitherT[Future]

  }

  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData): PaypalResult[Payment] =
    (for {
      transaction <- getTransaction(Payment.get(apiContext, capturePaypalPaymentData.paymentData.paymentId))
      relatedResources <- getRelatedResources(transaction)
      capture <- getCapture(relatedResources, transaction)
      captureResult <- validateCapture(capture)
      payment <- getPayment(captureResult.getParentPayment)
    } yield payment).toEitherT[Future]


  def executePayment(executePaymentData: ExecutePaypalPaymentData): PaypalResult[Payment] =
    (for {
        payment <- executePayment(executePaymentData.paymentData.paymentId, executePaymentData.paymentData.payerId)
        validatedPayment <- validatePayment(payment)
      } yield validatedPayment).toEitherT[Future]


  def validateEvent(headers: Map[String, String], body: String): PaypalResult[Unit] = {
    Either.catchNonFatal {
      val context = apiContext.addConfiguration(Constants.PAYPAL_WEBHOOK_ID, config.hookId)
      if(Event.validateReceivedEvent(context, headers.asJava, body))
        ()
      else {
        logger.error(s"Palpal has invalidated webhook request. Verify config.hookId: ${config.hookId}. JSON: $body")
        throw new Exception("Invalid hook request")
      }
    }.leftMap(PaypalApiError.fromThrowable).toEitherT[Future]
  }


  private def buildPaypalTransactions(currencyCode: String, amount: BigDecimal): java.util.List[Transaction] = {
    import scala.collection.JavaConverters._

    val Description = "Contribution to the guardian"
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

  private def getTransaction(payment: Payment): Either[PaypalApiError, Transaction] =
    Either.fromOption(payment.getTransactions.asScala.headOption, PaypalApiError
      .fromString(s"Invaid Paypal transactions content. Verify payment"))


  private def getRelatedResources(transaction: Transaction): Either[PaypalApiError, RelatedResources] =
    Either.fromOption(transaction.getRelatedResources.asScala.headOption, PaypalApiError
      .fromString(s"Invaid Paypal payment status. Payer has not approved payment"))


  private def getCapture(relatedResources: RelatedResources, transaction: Transaction): Either[PaypalApiError, Capture] =
    Either.catchNonFatal(relatedResources
      .getAuthorization
      .capture(apiContext, buildCaptureByTransaction(transaction))).leftMap(PaypalApiError.fromThrowable)


  private def validateCapture(capture: Capture): Either[PaypalApiError, Capture] = {
    if (capture.getState.toUpperCase.equalsIgnoreCase("COMPLETED"))
      Right(capture)
    else
      Left(PaypalApiError.fromString(s"payment returned invalid state: ${capture.getState}"))
  }

  private def getPayment(paymentId: String): Either[PaypalApiError, Payment] =
    Either.catchNonFatal(Payment.get(apiContext, paymentId)).leftMap(PaypalApiError.fromThrowable)


  private def buildCaptureByTransaction(transaction: Transaction): Capture = {
    val amount = transaction.getAmount
    val amountToSend = new Amount()
    amountToSend.setCurrency(amount.getCurrency)
    amountToSend.setTotal(amount.getTotal)
    val capture = new Capture()
    capture.setAmount(amountToSend)
    capture.setIsFinalCapture(true)
    capture
  }

  private def validatePayment(payment: Payment): Either[PaypalApiError, Payment] = {
    if (payment.getState.toUpperCase.equalsIgnoreCase("APPROVED"))
      Right(payment)
    else
      Left(PaypalApiError.fromString(s"payment returned invalid state: ${payment.getState}"))
  }

  private def executePayment(paymentId: String, payerId: String): Either[PaypalApiError, Payment] = {
    val payment = new Payment().setId(paymentId)
    val paymentExecution = new PaymentExecution().setPayerId(payerId)
    Either.catchNonFatal(payment.execute(apiContext, paymentExecution)).leftMap(PaypalApiError.fromThrowable)
  }

}

object PaypalService {

  def fromPaypalConfig(config: PaypalConfig)(implicit pool: PaypalThreadPool): PaypalService =
    new PaypalService(config)
}
