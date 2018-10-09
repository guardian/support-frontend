package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.validated._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.sqs.model.SendMessageResult
import com.stripe.model.Charge
import com.typesafe.scalalogging.StrictLogging
import conf.ConfigLoader._
import conf._
import model._
import model.acquisition.StripeAcquisition
import model.db.ContributionData
import model.email.ContributorRow
import model.stripe.{StripeApiError, StripeChargeData, StripeChargeSuccess, StripeRefundHook}
import play.api.libs.ws.WSClient
import services._
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

// Provides methods required by the Stripe controller
class StripeBackend(
    stripeService: StripeService,
    databaseService: DatabaseService,
    identityService: IdentityService,
    ophanService: OphanService,
    emailService: EmailService,
    cloudWatchService: CloudWatchService
)(implicit pool: DefaultThreadPool) extends StrictLogging {

  // Ok using the default thread pool - the mapping function is not computationally intensive, nor does is perform IO.
  def createCharge(data: StripeChargeData, countrySubdivisionCode: Option[String]): EitherT[Future, StripeApiError, StripeChargeSuccess] =
    stripeService.createCharge(data)
      .bimap(
        err => {
          logger.error(s"unable to create Stripe charge ($data)", err)
          cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
          err
        },
        charge => {
          cloudWatchService.recordPaymentSuccess(PaymentProvider.Stripe)
          val email = data.signedInUserEmail.getOrElse(data.paymentData.email)

          postPaymentTasks(email, data, charge, countrySubdivisionCode)
            .leftMap { err =>
              cloudWatchService.recordPostPaymentTasksError(PaymentProvider.Stripe)
              logger.error(
                s"didn't complete post-payment tasks after creating Stripe charge - ${charge.toString}",
                err
              )
              err
            }

          StripeChargeSuccess.fromCharge(charge)
        }
      )

  def processRefundHook(refundHook: StripeRefundHook): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(refundHook)
      dbUpdateResult <- flagContributionAsRefunded(refundHook.data.`object`.id)
    } yield dbUpdateResult
  }

  private def postPaymentTasks(email: String, data: StripeChargeData, charge: Charge, countrySubdivisionCode: Option[String]): EitherT[Future, BackendError, Unit] = {

    val identityIdM: EitherT[Future, BackendError, Long] = getOrCreateIdentityIdFromEmail(email)

    val trackContributionResult = {
      identityIdM
        .flatMap(identityId => trackContribution(charge, data, Option(identityId), countrySubdivisionCode))
        .leftMap { err =>
          logger.warn(s"unable to get identity id for email $email, tracking acquisition anyway")
          trackContribution(charge, data, identityId = None, countrySubdivisionCode)
            .leftMap(trackErr => logger.error(s"unable to track contribution due to error: ${trackErr.getMessage}"))
          err
        }
    }

    val sendThankYouEmailResult = for {
      identityId <- identityIdM
      _ <- sendThankYouEmail(email, data, identityId)
    } yield ()

    BackendError.combineResults(
      trackContributionResult,
      sendThankYouEmailResult
    )
  }

  private def trackContribution(charge: Charge, data: StripeChargeData, identityId: Option[Long], countrySubdivisionCode: Option[String]): EitherT[Future, BackendError, Unit]  =
    BackendError.combineResults(
      insertContributionDataIntoDatabase(ContributionData.fromStripeCharge(identityId, charge, countrySubdivisionCode)),
      submitAcquisitionToOphan(StripeAcquisition(data, charge, identityId))
    )

  // Convert the result of the identity id operation,
  // into the monad used by the for comprehension in the createCharge() method.
  private def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, Long] =
    identityService.getOrCreateIdentityIdFromEmail(email).leftMap(BackendError.fromIdentityError)

  private def insertContributionDataIntoDatabase(contributionData: ContributionData): EitherT[Future, BackendError, Unit] = {
    // log so that if something goes wrong we can reconstruct the missing data from the logs
    logger.info(s"about to insert contribution into database: $contributionData")
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)
  }

  private def submitAcquisitionToOphan(acquisition: StripeAcquisition): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(acquisition)
      .bimap(BackendError.fromOphanError, _ => ())

  private def validateRefundHook(refundHook: StripeRefundHook): EitherT[Future, BackendError, Unit] =
    stripeService.validateRefundHook(refundHook)
      .leftMap(BackendError.fromStripeApiError)

  private def flagContributionAsRefunded(stripePaymentId: String): EitherT[Future, BackendError, Unit] =
    databaseService.flagContributionAsRefunded(stripePaymentId)
      .leftMap(BackendError.fromDatabaseError)

  private def sendThankYouEmail(email: String, data: StripeChargeData, identityId: Long): EitherT[Future, BackendError, SendMessageResult] = {
    val contributorRow = ContributorRow(
      email,
      data.paymentData.currency.toString,
      identityId,
      PaymentProvider.Stripe,
      None,
      data.paymentData.amount
    )

    emailService.sendThankYouEmail(contributorRow).leftMap(BackendError.fromEmailError)
  }

}

object StripeBackend {

  private def apply(
    stripeService: StripeService,
    databaseService: DatabaseService,
    identityService: IdentityService,
    ophanService: OphanService,
    emailService: EmailService,
    cloudWatchService: CloudWatchService
  )(implicit pool: DefaultThreadPool): StripeBackend = {
    new StripeBackend(stripeService, databaseService, identityService, ophanService, emailService, cloudWatchService)
  }

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider, cloudWatchAsyncClient: AmazonCloudWatchAsync)(
    implicit defaultThreadPool: DefaultThreadPool,
    stripeThreadPool: StripeThreadPool,
    jdbcThreadPool: JdbcThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[StripeBackend] {

    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader
        .loadConfig[Environment, StripeConfig](env)
        .map(StripeService.fromStripeConfig): InitializationResult[StripeService],
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
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService]
    ).mapN(StripeBackend.apply)
  }
}

