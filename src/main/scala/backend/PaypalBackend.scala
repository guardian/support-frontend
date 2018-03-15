package backend

import cats.Semigroup
import cats.data.EitherT
import cats.instances.future._
import cats.instances.unit._
import cats.syntax.apply._
import cats.syntax.either._
import com.gu.acquisition.model.errors.OphanServiceError
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

  import PaypalBackend._

  def combineResults(
    result1: EitherT[Future, PaypalBackendError, Unit],
    result2:  EitherT[Future, PaypalBackendError, Unit])(implicit pool: DefaultThreadPool):  EitherT[Future, PaypalBackendError, Unit] = {
      EitherT(for {
        r1 <- result1.toValidated
        r2 <- result2.toValidated
      } yield {
        r1.combine(r2).toEither
      })
  }

  def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Option[Long]] =
    identityService.getOrCreateIdentityIdFromEmail(email).leftMap(PaypalBackendError.fromIdentityError).map(Option(_))
      .recover {
        case err =>
          logger.error("Error getting identityId", err)
          None
      }

  def insertContributionDataToPostgres(contributionData: ContributionData)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Unit] =
    databaseService.insertContributionData(contributionData).leftMap(PaypalBackendError.fromDatabaseError)

  def submitAcquisitionToOphan(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long])(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Unit] =
    ophanService.submitAcquisition(PaypalAcquisition(payment, acquisitionData, identityId)).bimap(PaypalBackendError.fromOphanError, _ => ())

  def getPaymentFromPaypalExecutePaymentData(paypalExecutePaymentData: ExecutePaypalPaymentData)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Payment] =
    paypalService.executePayment(paypalExecutePaymentData).leftMap(PaypalBackendError.fromPaypalAPIError)

  def getPaymentFromCapturePaypalPaymentData(capturePaypalPaymentData: CapturePaypalPaymentData)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Payment] =
    paypalService.capturePayment(capturePaypalPaymentData).leftMap(PaypalBackendError.fromPaypalAPIError)

  def getContributionDataFromPaypalCharge(identityId: Option[Long], payment: Payment)(implicit pool: DefaultThreadPool): Either[PaypalBackendError, ContributionData] =
    ContributionData.fromPaypalCharge(identityId, payment).leftMap(_ => PaypalBackendError.fromDatabaseError(null))

  /*
   *  Use by Webs: First stage to create a paypal payment. Using -sale- paypal flow combining authorization
   *  and capture process in one transaction. Sale option, PayPal processes the payment without holding funds.
   */
  def createPayment(paypalPaymentData: CreatePaypalPaymentData)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Payment] =
    paypalService.createPayment(paypalPaymentData).leftMap(PaypalBackendError.fromPaypalAPIError)


  def trackContribution(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long])(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Unit]  = {
    getContributionDataFromPaypalCharge(identityId, payment)
      .toEitherT[Future]
      .flatMap { contributionData =>
        combineResults(
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
  EitherT[Future, PaypalBackendError, Payment] = {
    for {
      payment <- getPaymentFromCapturePaypalPaymentData(capturePaypalPaymentData)
      identityId <- getOrCreateIdentityIdFromEmail(payment.getPayer.getPayerInfo.getEmail)
      _ = trackContribution(payment, capturePaypalPaymentData.acquisitionData, identityId)
      _ = emailService.sendPaypalThankEmail(payment, capturePaypalPaymentData.acquisitionData.campaignCodes)
    } yield payment
  }

  def executePayment(paypalExecutePaymentData: ExecutePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, PaypalBackendError, Payment] = {
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

  sealed abstract class PaypalBackendError extends Exception {
    override def getMessage: String = this match {
      case PaypalBackendError.Database(err) => err.getMessage
      case PaypalBackendError.Service(err) => err.getMessage
      case PaypalBackendError.Ophan(err) => err.getMessage
      case PaypalBackendError.PayPalAPI(err) => err.message
      case PaypalBackendError.MultipleErrors(errors) => errors.map(_.getMessage).mkString("&")
    }
  }

  object PaypalBackendError {
    final case class Database(error: DatabaseService.Error) extends PaypalBackendError
    final case class Service(error: IdentityClient.Error) extends PaypalBackendError
    final case class Ophan(error: OphanServiceError) extends PaypalBackendError
    final case class PayPalAPI(error: PaypalApiError) extends PaypalBackendError
    final case class MultipleErrors(errors: List[PaypalBackendError]) extends PaypalBackendError

    implicit val payPalBackendSemiGroup: Semigroup[PaypalBackendError] =
      Semigroup.instance((x,y) => MultipleErrors(List(x,y)))

    def fromIdentityError(err: IdentityClient.Error): PaypalBackendError = Service(err)
    def fromDatabaseError(err: DatabaseService.Error): PaypalBackendError= Database(err)
    def fromOphanError(err: OphanServiceError): PaypalBackendError = Ophan(err)
    def fromPaypalAPIError(err: PaypalApiError): PaypalBackendError = PayPalAPI(err)
  }
}

