package backend

import backend.PaypalBackend.PaypalBackendError
import cats.data.EitherT
import com.paypal.api.payments.Payment
import model.db.ContributionData
import model.paypal.{CapturePaypalPaymentData, CreatePaypalPaymentData, ExecutePaypalPaymentData, PaypalApiError}
import model._
import services._
import util.EnvironmentBasedBuilder
import cats.implicits._
import com.typesafe.scalalogging.StrictLogging
import model.acquisition.PaypalAcquisition
import play.api.libs.ws.WSClient

import scala.concurrent.Future
import conf._

class PaypalBackend(paypalService: PaypalService, databaseService: DatabaseService,
  identityService: IdentityService, ophanService: OphanService, emailService: EmailService) extends StrictLogging {


  // Convert the result of the identity id operation,
  // into the monad used by the for comprehension in the createCharge() method.
  def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Long] =
    identityService.getOrCreateIdentityIdFromEmail(email).leftMap(PaypalBackendError.fromIdentityError)

  def insetContributionDataToPostgres(contributionData: ContributionData)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Unit] = {
    databaseService.insertContributionData(contributionData).leftMap(PaypalBackendError.fromDatabaseError)
  }



  def trackContribution(payment: Payment, acquisitionData: AcquisitionData)(implicit pool: DefaultThreadPool): EitherT[Future, PaypalBackendError, Unit]  = {
    getOrCreateIdentityIdFromEmail(payment.getPotentialPayerInfo.getEmail).map(Option(_))
      .recover {
        case err => {
          logger.error(err.getMessage)
          None
        }
      }
      .map { identityId =>
        ContributionData.fromPaypalCharge(identityId, payment)
          .map {
            contributionData => {
              insetContributionDataToPostgres(contributionData)
              //leaving this here for now until we add identityId to the acquisition thrift model
              ophanService.submitAcquisition(PaypalAcquisition(payment, acquisitionData))
            }
          }
      }
  }


  /*
   *  Use by Webs: First stage to create a paypal payment. Using -sale- paypal flow combining authorization
   *  and capture process in one transaction. Sale option, PayPal processes the payment without holding funds.
   */
  def createPayment(paypalPaymentData: CreatePaypalPaymentData): EitherT[Future, PaypalApiError, Payment] =
    paypalService.createPayment(paypalPaymentData)


  /*
   *  Use by Apps: Apps have previously created the payment and managed its approval with the customer.
   *  Funds are captured at this stage.
   */
  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, PaypalApiError, Payment] = {
    for {
      payment <- paypalService.capturePayment(capturePaypalPaymentData)
      _ = trackContribution(payment, capturePaypalPaymentData.acquisitionData)
      _ = emailService.sendPaypalThankEmail(payment, capturePaypalPaymentData.acquisitionData.campaignCodes)
    } yield payment
  }

  def executePayment(paypalExecutePaymentData: ExecutePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, PaypalApiError, Payment] = {
    for {
      payment <- paypalService.executePayment(paypalExecutePaymentData)
      _ = trackContribution(payment, paypalExecutePaymentData.acquisitionData)
      _ = emailService.sendPaypalThankEmail(payment, paypalExecutePaymentData.acquisitionData.campaignCodes)
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
        .configForEnvironment[PaypalConfig](env)
        .map(PaypalService.fromPaypalConfig): InitializationResult[PaypalService],
      databaseProvider
        .loadDatabase(env)
        .map(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService],
      configLoader
        .configForEnvironment[IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService],
      configLoader
      .configForEnvironment[OphanConfig](env)
      .andThen(OphanService.fromOphanConfig(_)): InitializationResult[OphanService],
      configLoader
        .configForEnvironment[EmailConfig](env)
        .andThen(EmailService.fromEmailConfig(_)): InitializationResult[EmailService]
    ).mapN(PaypalBackend.apply)
  }

  sealed abstract class PaypalBackendError extends Exception {
    override def getMessage: String = this match {
      case PaypalBackendError.Database(err) => err.getMessage
      case PaypalBackendError.Service(err) => err.getMessage
    }
  }

  object PaypalBackendError {
    final case class Database(error: DatabaseService.Error) extends PaypalBackendError
    final case class Service(error: IdentityClient.Error) extends PaypalBackendError

    def fromIdentityError(err: IdentityClient.Error): PaypalBackendError = Service(err)
    def fromDatabaseError(err: DatabaseService.Error): PaypalBackendError= Database(err)
  }
}

