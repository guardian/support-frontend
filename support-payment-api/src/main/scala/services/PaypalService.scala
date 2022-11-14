package services

import cats.data.EitherT
import cats.syntax.all._
import com.paypal.api.payments._
import com.paypal.base.Constants
import com.paypal.base.rest.APIContext
import com.typesafe.scalalogging.StrictLogging
import conf.PaypalConfig
import model.paypal._
import model.PaypalThreadPool

import scala.concurrent.Future
import scala.math.BigDecimal.RoundingMode
import scala.jdk.CollectionConverters._

trait Paypal {
  type PaypalResult[A] = EitherT[Future, PaypalApiError, A]
  def createPayment(createPaypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment]
  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData): PaypalResult[Payment]
  def executePayment(executePaymentData: ExecutePaypalPaymentData): PaypalResult[Payment]
  def validateWebhookEvent(headers: Map[String, String], body: String): PaypalResult[Unit]
}

class PaypalService(config: PaypalConfig)(implicit pool: PaypalThreadPool) extends Paypal with StrictLogging {

  def createPayment(createPaypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment] = {
    if (model.Currency.exceedsMaxAmount(createPaypalPaymentData.amount, createPaypalPaymentData.currency)) {
      Left(PaypalApiError.fromString("Amount exceeds the maximum allowed ")).toEitherT[Future]
    } else {
      Either
        .catchNonFatal {

          val payer = new Payer().setPaymentMethod("paypal")

          val transactions =
            buildPaypalTransactions(createPaypalPaymentData.currency.entryName, createPaypalPaymentData.amount)

          val redirectUrls = new RedirectUrls()
            .setCancelUrl(createPaypalPaymentData.cancelURL)
            .setReturnUrl(createPaypalPaymentData.returnURL)

          val paypalPayment = new Payment()
            .setIntent("sale")
            .setPayer(payer)
            .setTransactions(transactions)
            .setRedirectUrls(redirectUrls)

          paypalPayment.create(buildAPIContext)

        }
        .leftMap { error =>
          logger.error(s"Error creating paypal payment. Error: $error")
          PaypalApiError.fromThrowable(error)
        }
        .toEitherT[Future]
    }
  }

  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData): PaypalResult[Payment] =
    (for {
      paypalPayment <- getPayment(capturePaypalPaymentData.paymentData.paymentId)
      transaction <- getTransaction(paypalPayment)
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

  def validateWebhookEvent(headers: Map[String, String], body: String): PaypalResult[Unit] = {
    Either
      .catchNonFatal {
        val context = buildAPIContext.addConfiguration(Constants.PAYPAL_WEBHOOK_ID, config.hookId)
        if (Event.validateReceivedEvent(context, headers.asJava, body)) {
          ()
        } else {
          val msg = "Webhook event is not valid. " +
            s"Does the hook id from your config (${config.hookId}) match the id received from PayPal? " +
            s"If not, check in the PayPal developer console for the correct hook id for your app. " +
            s"PayPal sent body: $body"

          throw new Exception(msg)
        }
      }
      .leftMap { error =>
        val message = s"Could not validate PayPal webhook event. Error: $error"
        logger.error(message)
        PaypalApiError.fromString(message)
      }
      .toEitherT[Future]
  }

  private def buildAPIContext: APIContext = {
    new APIContext(config.clientId, config.clientSecret, config.paypalMode.entryName)
  }

  private def buildPaypalTransactions(currencyCode: String, amount: BigDecimal): java.util.List[Transaction] = {
    import scala.jdk.CollectionConverters._

    val description = "Contribution to the guardian"
    val stringAmount = amount.setScale(2, RoundingMode.HALF_UP).toString

    val paypalAmount = new Amount()
      .setCurrency(currencyCode)
      .setTotal(stringAmount)

    val item = new Item()
      .setDescription(description)
      .setCurrency(currencyCode)
      .setPrice(stringAmount)
      .setQuantity("1")

    val itemList = new ItemList()
      .setItems(List(item).asJava)

    val transaction = new Transaction
    transaction.setAmount(paypalAmount)
    transaction.setDescription(description)
    transaction.setItemList(itemList)

    List(transaction).asJava
  }

  private def getTransaction(payment: Payment): Either[PaypalApiError, Transaction] =
    Either.fromOption(
      payment.getTransactions.asScala.headOption,
      PaypalApiError
        .fromString(s"Invalid Paypal transactions content. Verify payment"),
    )

  private def getRelatedResources(transaction: Transaction): Either[PaypalApiError, RelatedResources] =
    Either.fromOption(
      transaction.getRelatedResources.asScala.headOption,
      PaypalApiError
        .fromString(s"Invalid Paypal payment status. Payer has not approved payment"),
    )

  private def getCapture(
      relatedResources: RelatedResources,
      transaction: Transaction,
  ): Either[PaypalApiError, Capture] = {
    Either
      .catchNonFatal(
        relatedResources.getAuthorization
          .capture(buildAPIContext, buildCaptureByTransaction(transaction)),
      )
      .leftMap { error =>
        logger.error(s"Error getting capture from related resources. Error: $error")
        PaypalApiError.fromThrowable(error)
      }
  }

  private def validateCapture(capture: Capture): Either[PaypalApiError, Capture] = {
    if (capture.getState.toUpperCase.equalsIgnoreCase("COMPLETED"))
      Right(capture)
    else {
      logger.error(s"Invalid capture paypal state: ${capture.getState} ")
      Left(PaypalApiError.fromString(s"payment returned invalid state: ${capture.getState}"))
    }

  }

  private def getPayment(paymentId: String): Either[PaypalApiError, Payment] = {
    Either.catchNonFatal(Payment.get(buildAPIContext, paymentId)).leftMap(PaypalApiError.fromThrowable)
  }

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
    else {
      logger.error(s"Invalid paypal state: ${payment.getState} ")
      Left(PaypalApiError.fromString(s"payment returned invalid state: ${payment.getState}"))
    }

  }

  private def executePayment(paymentId: String, payerId: String): Either[PaypalApiError, Payment] = {
    val payment = new Payment().setId(paymentId)
    val paymentExecution = new PaymentExecution().setPayerId(payerId)
    Either.catchNonFatal(payment.execute(buildAPIContext, paymentExecution)).leftMap(PaypalApiError.fromThrowable)
  }

}

object PaypalService {

  def fromPaypalConfig(config: PaypalConfig)(implicit pool: PaypalThreadPool): PaypalService =
    new PaypalService(config)
}
