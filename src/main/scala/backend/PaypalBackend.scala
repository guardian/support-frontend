package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.either._
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

class PaypalBackend(
    paypalService: PaypalService,
    databaseService: DatabaseService,
    identityService: IdentityService,
    ophanService: OphanService,
    emailService: EmailService
)(implicit pool: DefaultThreadPool) extends StrictLogging {

  def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, Option[Long]] =
    identityService.getOrCreateIdentityIdFromEmail(email)
      .leftMap(BackendError.fromIdentityError)
      .map(Option(_))
      .recover {
        case err =>
          logger.error("Error getting identityId", err)
          None
      }

  def insertContributionDataToPostgres(contributionData: ContributionData): EitherT[Future, BackendError, Unit] =
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)

  def submitAcquisitionToOphan(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long]): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(PaypalAcquisition(payment, acquisitionData, identityId))
      .bimap(BackendError.fromOphanError, _ => ())

  def getPaymentFromPaypalExecutePaymentData(paypalExecutePaymentData: ExecutePaypalPaymentData): EitherT[Future, BackendError, Payment] =
    paypalService.executePayment(paypalExecutePaymentData)
      .leftMap(BackendError.fromPaypalAPIError)

  def getPaymentFromCapturePaypalPaymentData(capturePaypalPaymentData: CapturePaypalPaymentData): EitherT[Future, BackendError, Payment] =
    paypalService.capturePayment(capturePaypalPaymentData)
      .leftMap(BackendError.fromPaypalAPIError)

  def getContributionDataFromPaypalCharge(identityId: Option[Long], payment: Payment): Either[BackendError, ContributionData] =
    ContributionData.fromPaypalCharge(identityId, payment)
      .leftMap{ error =>
        val message = s"Error creating contribution data from paypal. Error: $error"
        logger.error(message)
        BackendError.fromDatabaseError(DatabaseService.Error(message, Some(new Exception(error.message))))
      }

  /*
   *  Use by Webs: First stage to create a paypal payment. Using -sale- paypal flow combining authorization
   *  and capture process in one transaction. Sale option, PayPal processes the payment without holding funds.
   */
  def createPayment(paypalPaymentData: CreatePaypalPaymentData): EitherT[Future, BackendError, Payment] =
    paypalService.createPayment(paypalPaymentData)
      .leftMap{ error =>
        logger.error(s"Error creating paypal payment data. Error: $error")
        BackendError.fromPaypalAPIError(error)
      }


  def trackContribution(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long]): EitherT[Future, BackendError, Unit]  = {
    getContributionDataFromPaypalCharge(identityId, payment)
      .toEitherT[Future]
      .flatMap { contributionData =>
        BackendError.combineResults(
          submitAcquisitionToOphan(payment, acquisitionData, contributionData.identityId),
          insertContributionDataToPostgres(contributionData)
        )
      }
      .leftMap { err =>
        logger.error("Error tracking contribution", err)
        err
      }
  }


  /*
   *  Use by Apps: Apps have previously created the payment and managed its approval with the customer.
   *  Funds are captured at this stage.
   */
  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData):
  EitherT[Future, BackendError, Payment] = {
    for {
      payment <- getPaymentFromCapturePaypalPaymentData(capturePaypalPaymentData)
      paymentEmail <- Either.catchNonFatal(payment.getPayer.getPayerInfo.getEmail)
        .leftMap(error => BackendError.fromPaypalAPIError(PaypalApiError.fromThrowable(error))).toEitherT
      identityId <- getOrCreateIdentityIdFromEmail(paymentEmail)
      _ = trackContribution(payment, capturePaypalPaymentData.acquisitionData, identityId)
      _ = emailService.sendThankYouEmail(capturePaypalPaymentData.signedInUserEmail.getOrElse(paymentEmail))
    } yield payment
  }

  def executePayment(paypalExecutePaymentData: ExecutePaypalPaymentData):
  EitherT[Future, BackendError, Payment] = {
    for {
      payment <- getPaymentFromPaypalExecutePaymentData(paypalExecutePaymentData)
      paymentEmail <- Either.catchNonFatal(payment.getPayer.getPayerInfo.getEmail)
        .leftMap(error => BackendError.fromPaypalAPIError(PaypalApiError.fromThrowable(error))).toEitherT
      email = paypalExecutePaymentData.signedInUserEmail.getOrElse(paymentEmail)
      identityId <- getOrCreateIdentityIdFromEmail(email)
      _ = trackContribution(payment, paypalExecutePaymentData.acquisitionData, identityId)
      _ = emailService.sendThankYouEmail(email)
    } yield payment
  }

  def processPaymentHook(paypalHook: PaypalHook, headers: Map[String, String], rawJson: String):
  EitherT[Future, PaypalApiError, Unit] = {
    for {
      payment <- paypalService.validateEvent(headers, rawJson)
      _ = databaseService.updatePaymentHook(paypalHook.resource.parent_payment, paypalHook.event_type.entryName)
    } yield payment
  }

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

