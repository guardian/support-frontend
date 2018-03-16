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
) extends StrictLogging {

  def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Option[Long]] =
    identityService.getOrCreateIdentityIdFromEmail(email)
      .leftMap(BackendError.fromIdentityError)
      .map(Option(_))
      .recover {
        case err =>
          logger.error("Error getting identityId", err)
          None
      }

  def insertContributionDataToPostgres(contributionData: ContributionData)(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Unit] =
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)

  def submitAcquisitionToOphan(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long])(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(PaypalAcquisition(payment, acquisitionData, identityId))
      .bimap(BackendError.fromOphanError, _ => ())

  def getPaymentFromPaypalExecutePaymentData(paypalExecutePaymentData: ExecutePaypalPaymentData)(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Payment] =
    paypalService.executePayment(paypalExecutePaymentData)
      .leftMap(BackendError.fromPaypalAPIError)

  def getPaymentFromCapturePaypalPaymentData(capturePaypalPaymentData: CapturePaypalPaymentData)(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Payment] =
    paypalService.capturePayment(capturePaypalPaymentData)
      .leftMap(BackendError.fromPaypalAPIError)

  def getContributionDataFromPaypalCharge(identityId: Option[Long], payment: Payment)(implicit pool: DefaultThreadPool): Either[BackendError, ContributionData] =
    ContributionData.fromPaypalCharge(identityId, payment)
      .leftMap(_ => BackendError.fromDatabaseError(null))

  /*
   *  Use by Webs: First stage to create a paypal payment. Using -sale- paypal flow combining authorization
   *  and capture process in one transaction. Sale option, PayPal processes the payment without holding funds.
   */
  def createPayment(paypalPaymentData: CreatePaypalPaymentData)(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Payment] =
    paypalService.createPayment(paypalPaymentData)
      .leftMap(BackendError.fromPaypalAPIError)


  def trackContribution(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long])(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Unit]  = {
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
  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, BackendError, Payment] = {
    for {
      payment <- capturePayment(capturePaypalPaymentData)
      identityId <- getOrCreateIdentityIdFromEmail(payment.getPayer.getPayerInfo.getEmail)
      _ = trackContribution(payment, capturePaypalPaymentData.acquisitionData, identityId)
      _ = emailService.sendPaypalThankEmail(payment, capturePaypalPaymentData.acquisitionData.campaignCodes)
    } yield payment
  }

  def executePayment(paypalExecutePaymentData: ExecutePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, BackendError, Payment] = {
    for {
      payment <- getPaymentFromPaypalExecutePaymentData(paypalExecutePaymentData)

      signedInUserEmail = paypalExecutePaymentData.signedInUserEmail
      paymentEmail = payment.getPayer.getPayerInfo.getEmail
      email = signedInUserEmail.getOrElse(paymentEmail)

      identityId <- getOrCreateIdentityIdFromEmail(email)
      _ = trackContribution(payment, paypalExecutePaymentData.acquisitionData, identityId)
      _ = emailService.sendPaypalThankEmail(payment, paypalExecutePaymentData.acquisitionData.campaignCodes)
    } yield payment
  }

  def processPaymentHook(paypalHook: PaypalHook, headers: Map[String, String], rawJson: String)(implicit pool: DefaultThreadPool):
  EitherT[Future, PaypalApiError, Unit] = {
    for {
      payment <- paypalService.validateEvent(headers, rawJson)
      _ = databaseService.updatePaymentHook(paypalHook.resource.parent_payment, paypalHook.event_type)
    } yield payment
  }

}

object PaypalBackend {

  private def apply(paypalService: PaypalService, databaseService: DatabaseService, identityService: IdentityService,
    ophanService: OphanService, emailService: EmailService): PaypalBackend =
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

