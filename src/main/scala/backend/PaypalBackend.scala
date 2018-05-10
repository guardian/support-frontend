package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.either._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.paypal.api.payments.Payment
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient
import conf._
import conf.ConfigLoader._
import model._
import model.acquisition.PaypalAcquisition
import model.db.ContributionData
import model.paypal._
import services._
import util.EnvironmentBasedBuilder

import scala.concurrent.Future
import scala.collection.JavaConverters._

class PaypalBackend(
    paypalService: PaypalService,
    databaseService: DatabaseService,
    identityService: IdentityService,
    ophanService: OphanService,
    emailService: EmailService
)(implicit pool: DefaultThreadPool) extends StrictLogging {

  /*
   * Used by web clients.
   * Creates a payment which must be authorised by the user via PayPal's web UI.
   * Once authorised, the payment can be executed via the execute-payment endpoint.
   */
  def createPayment(c: CreatePaypalPaymentData): EitherT[Future, BackendError, Payment] =
    paypalService.createPayment(c)
      .leftMap { error =>
        logger.error(s"Error creating paypal payment data. Error: $error")
        BackendError.fromPaypalAPIError(error)
      }

  /*
   * Used by Android app clients.
   * The Android app creates and approves the payment directly via PayPal.
   * Funds are captured via this endpoint.
   */
  def capturePayment(c: CapturePaypalPaymentData): EitherT[Future, BackendError, Payment] =
    paypalService.capturePayment(c)
      .bimap(
        err => BackendError.fromPaypalAPIError(err),
        payment => {
          postPaymentTasks(payment, c.signedInUserEmail, c.acquisitionData)
            .leftMap { err =>
              logger.error(s"Didn't complete post-payment tasks after capturing PayPal payment. " +
                s"Payment: ${payment.toString}. " +
                s"Error(s): ${err.getMessage}")

              err
            }

          payment
        }
      )

  def executePayment(e: ExecutePaypalPaymentData): EitherT[Future, BackendError, Payment] =
    paypalService.executePayment(e)
      .bimap(
        err => BackendError.fromPaypalAPIError(err),
        payment => {
          postPaymentTasks(payment, e.signedInUserEmail, e.acquisitionData)
            .leftMap { err =>
              logger.error(s"Didn't complete post-payment tasks after executing PayPal payment. " +
                s"Payment: ${payment.toString}. " +
                s"Error(s): ${err.getMessage}")

              err
            }

          payment
        }
      )

  def processRefundHook(refundHook: PaypalRefundHook, headers: Map[String, String], rawJson: String): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(headers, rawJson)
      dbUpdateResult <- flagContributionAsRefunded(refundHook.resource.parent_payment)
    } yield dbUpdateResult
  }

  // Success or failure of these steps shouldn't affect the response to the client
  private def postPaymentTasks(payment: Payment, signedInUserEmail: Option[String], acquisitionData: AcquisitionData): EitherT[Future, BackendError, Unit] = {
    emailFromPayment(payment).flatMap { paymentEmail =>
      val email = signedInUserEmail.getOrElse(paymentEmail)

      val trackContributionResult = for {
        identityId <- getOrCreateIdentityIdFromEmail(email)
        _ <- trackContribution(payment, acquisitionData, email, identityId)
      } yield ()

      val sendThankYouEmailResult = for {
        currency <- currencyFromPayment(payment)
        _ <- sendThankYouEmail(email, currency)
      } yield ()

      BackendError.combineResults(
        trackContributionResult,
        sendThankYouEmailResult
      )
    }
  }

  private def trackContribution(payment: Payment, acquisitionData: AcquisitionData, email: String, identityId: Option[Long]): EitherT[Future, BackendError, Unit] = {
    ContributionData.fromPaypalCharge(payment, email, identityId)
      .leftMap { error =>
        logger.error(s"Error creating contribution data from paypal. Error: $error")
        BackendError.fromPaypalAPIError(error)
      }
      .toEitherT[Future]
      .flatMap { contributionData =>
        BackendError.combineResults(
          submitAcquisitionToOphan(payment, acquisitionData, contributionData.identityId),
          insertContributionDataIntoDatabase(contributionData)
        )
      }
      .leftMap { err =>
        logger.error("Error tracking contribution", err)
        err
      }
  }

  private def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, Option[Long]] =
    identityService.getOrCreateIdentityIdFromEmail(email)
      .leftMap(BackendError.fromIdentityError)
      .map(Option(_))
      .recover {
        case err =>
          logger.error("Error getting identityId", err)
          None
      }

  private def insertContributionDataIntoDatabase(contributionData: ContributionData): EitherT[Future, BackendError, Unit] =
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)

  private def submitAcquisitionToOphan(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long]): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(PaypalAcquisition(payment, acquisitionData, identityId))
      .bimap(BackendError.fromOphanError, _ => ())

  private def validateRefundHook(headers: Map[String, String], rawJson: String): EitherT[Future, BackendError, Unit] =
    paypalService.validateWebhookEvent(headers, rawJson)
      .leftMap(BackendError.fromPaypalAPIError)

  private def flagContributionAsRefunded(paypalPaymentId: String): EitherT[Future, BackendError, Unit] =
    databaseService.flagContributionAsRefunded(paypalPaymentId)
      .leftMap(BackendError.fromDatabaseError)

  private def sendThankYouEmail(email: String, currency: String): EitherT[Future, BackendError, SendMessageResult] =
    emailService.sendThankYouEmail(email, currency)
      .leftMap(BackendError.fromEmailError)

  private def emailFromPayment(p: Payment): EitherT[Future, BackendError, String] =
    Either.catchNonFatal(p.getPayer.getPayerInfo.getEmail)
      .leftMap(error => {
        logger.error("Could not get email from payment object in PayPal SDK", error)
        BackendError.fromPaypalAPIError(PaypalApiError.fromThrowable(error))
      }).toEitherT

  private def currencyFromPayment(p: Payment): EitherT[Future, BackendError, String] =
    Either.catchNonFatal(p.getTransactions.asScala.head.getAmount.getCurrency)
      .leftMap(error => {
        logger.error("Could not get currency from payment object in PayPal SDK", error)
        BackendError.fromPaypalAPIError(PaypalApiError.fromThrowable(error))
      }).toEitherT

}

object PaypalBackend {

  private def apply(paypalService: PaypalService, databaseService: DatabaseService, identityService: IdentityService,
    ophanService: OphanService, emailService: EmailService)(implicit pool: DefaultThreadPool): PaypalBackend =
    new PaypalBackend(paypalService, databaseService, identityService, ophanService, emailService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider)(
    implicit defaultThreadPool: DefaultThreadPool,
    paypalThreadPool: PaypalThreadPool,
    jdbcThreadPool: JdbcThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[PaypalBackend] {

    override def build(env: Environment): InitializationResult[PaypalBackend] = (
      configLoader
        .loadConfig[Environment, PaypalConfig](env)
        .map(PaypalService.fromPaypalConfig): InitializationResult[PaypalService],
      databaseProvider
        .loadDatabase(env)
        .map(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService],
      configLoader
        .loadConfig[Environment, IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService],
      configLoader
        .loadConfig[Environment, OphanConfig](env)
        .andThen(OphanService.fromOphanConfig): InitializationResult[OphanService],
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService]
    ).mapN(PaypalBackend.apply)
  }
}

