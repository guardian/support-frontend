package backend

import cats.instances.future._
import cats.data.EitherT
import cats.syntax.validated._
import cats.syntax.apply._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.typesafe.scalalogging.StrictLogging
import conf.{ConfigLoader, EmailConfig, IdentityConfig}
import model._
import model.db.ContributionData
import model.email.ContributorRow
import model.subscribewithgoogle.GoogleRecordPayment
import play.api.libs.ws.WSClient
import services._
import util.EnvironmentBasedBuilder
import conf.ConfigLoader._
import model.acquisition.SubscribeWithGoogleAcquisition
import services._

import scala.concurrent.Future


case class SubscribeWithGoogleDuplicateInsertEventError(msg: String) extends Exception(msg)

case class SubscribeWithGoogleBackend(databaseService: DatabaseService,
                                      identityService: IdentityService,
                                      ophanService: AnalyticsService,
                                      emailService: EmailService,
                                      cloudWatchService: CloudWatchService
                                     )(implicit pool: DefaultThreadPool) extends StrictLogging {

  def recordPayment(googleRecordPayment: GoogleRecordPayment,
                    clientBrowserInfo: ClientBrowserInfo): EitherT[Future, BackendError, Unit] = {
    for {
      alreadyProcessed <- isPaymentAlreadyProcessed(googleRecordPayment)
      processOutcome <- if (alreadyProcessed) {
        handleAlreadyProcessedPayment(googleRecordPayment)
      } else {
        handleFirstInstanceOfPayment(googleRecordPayment, clientBrowserInfo)
      }
    } yield processOutcome
  }

  def recordRefund(googleRecordPayment: GoogleRecordPayment): EitherT[Future, DatabaseService.Error, Unit] = {
    databaseService.flagContributionAsRefunded(googleRecordPayment.paymentId).leftMap { e =>
      logger.error(s"Failed to mark payment as failed for paymentId: ${googleRecordPayment.paymentId} with reason: ${e.getMessage}")
      cloudWatchService.recordTrackingRefundFailure(PaymentProvider.SubscribeWithGoogle)
      e
    }
  }

  private def handleAlreadyProcessedPayment(googleRecordPayment: GoogleRecordPayment): EitherT[Future, BackendError, Unit] = {
    logger.error(s"Received a duplicate payment id for payment : $googleRecordPayment")
    cloudWatchService.recordPostPaymentTasksError(PaymentProvider.SubscribeWithGoogle)
    EitherT.leftT[Future, Unit](BackendError.fromSubscribeWithGoogleDuplicatePaymentError(
      SubscribeWithGoogleDuplicateInsertEventError(s"Received a duplicate payment id for payment : $googleRecordPayment")))
  }

  private def handleFirstInstanceOfPayment(googleRecordPayment: GoogleRecordPayment,
                                           clientBrowserInfo: ClientBrowserInfo): EitherT[Future, BackendError, Unit] = {
    EitherT(getOrCreateIdentityIdFromEmail(googleRecordPayment.email).fold(
      _ => {
        logger.warn(s"unable to get identity id for email ${googleRecordPayment.email} with paymentId : ${googleRecordPayment.paymentId}, tracking acquisition anyway")
        handleContributionWithoutIdentity(googleRecordPayment, clientBrowserInfo).value
      }, id =>
        handleContributionWithIdentity(id, googleRecordPayment, clientBrowserInfo).value
    ).flatten)
  }

  private def handleContributionWithoutIdentity(googleRecordPayment: GoogleRecordPayment, clientBrowserInfo: ClientBrowserInfo) = {
    val trackContributionResult =
      insertContributionDataIntoDatabase(ContributionData.fromSubscribeWithGoogle(googleRecordPayment, None))
        .leftMap { err =>
          cloudWatchService.recordPostPaymentTasksError(PaymentProvider.SubscribeWithGoogle)
          logger.error(s"Unable to update contributions store with data: $googleRecordPayment due to error: ${err.getMessage}")
          err
        }.map { f =>
        cloudWatchService.recordPaymentSuccess(PaymentProvider.SubscribeWithGoogle)
        f
      }

    val ophanTrackingResult = submitAcquisitionToOphan(googleRecordPayment, None, clientBrowserInfo).leftMap { err =>
      cloudWatchService.recordPostPaymentTasksError(PaymentProvider.SubscribeWithGoogle)
      logger.error(s"Unable to submit data to Ophan with data: $googleRecordPayment due to error: ${err.getMessage}")
      err
    }

    BackendError.combineResults(
      trackContributionResult,
      ophanTrackingResult
    )
  }

  private def handleContributionWithIdentity(identity: Long, googleRecordPayment: GoogleRecordPayment, clientBrowserInfo: ClientBrowserInfo) = {
    val trackContributionResult =
      insertContributionDataIntoDatabase(ContributionData.fromSubscribeWithGoogle(googleRecordPayment, Some(identity)))
        .leftMap { err =>
          cloudWatchService.recordPostPaymentTasksError(PaymentProvider.SubscribeWithGoogle)
          logger.error(s"Unable to update contributions store with data: $googleRecordPayment due to error: ${err.getMessage}")
          err
        }.map { f =>
        cloudWatchService.recordPaymentSuccess(PaymentProvider.SubscribeWithGoogle)
        f
      }

    val ophanTrackingResult = submitAcquisitionToOphan(googleRecordPayment, Some(identity), clientBrowserInfo).leftMap { err =>
      cloudWatchService.recordPostPaymentTasksError(PaymentProvider.SubscribeWithGoogle)
      logger.error(s"Unable to submit data to Ophan with data: $googleRecordPayment due to error: ${err.getMessage}")
      err
    }

    val sendThankYouEmailResult = {
      val contributorRow = contributorRowFromPayment(identity, googleRecordPayment)
      emailService.sendThankYouEmail(contributorRow).bimap(
        l => BackendError.fromEmailError(l),
        _ => ()
      )
    }

    BackendError.combineResults(
      BackendError.combineResults(
        trackContributionResult,
        ophanTrackingResult
      ),
      sendThankYouEmailResult
    )
  }


  private def contributorRowFromPayment(identityId: Long, googleRecordPayment: GoogleRecordPayment): ContributorRow = {
    ContributorRow(googleRecordPayment.email,
      googleRecordPayment.currency,
      identityId,
      PaymentProvider.SubscribeWithGoogle,
      Some(googleRecordPayment.firstName),
      googleRecordPayment.amount)
  }

  private def submitAcquisitionToOphan(payment: GoogleRecordPayment,
                                       identityId: Option[Long],
                                       clientBrowserInfo: ClientBrowserInfo): EitherT[Future, BackendError, Unit] = {
    ophanService.submitAcquisition(SubscribeWithGoogleAcquisition(payment, identityId, clientBrowserInfo))
      .bimap(BackendError.fromOphanError, _ => ())
  }

  private def isPaymentAlreadyProcessed(googleRecordPayment: GoogleRecordPayment): EitherT[Future, BackendError, Boolean] = {
    EitherT[Future, BackendError, Boolean](Future.successful(Right(false)))
    /**
      * This lookup was removed during the migration to using a queue for database writes.
      * This lookup will need to be moved out to another app when swg is revisited.
      */
    //    databaseService.paymentAlreadyInserted(googleRecordPayment.paymentId).leftMap(
//      err => {
//        logger.error(s"Failure to select from database - trying to record payment for : $googleRecordPayment", err)
//        BackendError.fromDatabaseError(err)
//      }
//    )
  }

  private def insertContributionDataIntoDatabase(contributionData: ContributionData): EitherT[Future, BackendError, Unit] = {
    // log so that if something goes wrong we can reconstruct the missing data from the logs
    logger.info(s"about to insert contribution into database: $contributionData")
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)
  }

  private def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, Long] =
    identityService.getOrCreateIdentityIdFromEmail(email)
      .leftMap { err =>
        logger.error("Error getting identityId", err.getMessage)
        BackendError.fromIdentityError(err)
      }
}

object SubscribeWithGoogleBackend {

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider, cloudWatchAsyncClient: AmazonCloudWatchAsync)(
    implicit defaultThreadPool: DefaultThreadPool,
    subscribeWithGoogleThreadPool: SubscribeWithGoogleThreadPool,
    jdbcThreadPool: JdbcThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[SubscribeWithGoogleBackend] {

    override def build(env: Environment): InitializationResult[SubscribeWithGoogleBackend] = (
      databaseProvider
        .loadDatabase(env)
        .map(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService],
      configLoader
        .loadConfig[Environment, IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService],
      services.AnalyticsService(configLoader, env),
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService]
    ).mapN(SubscribeWithGoogleBackend.apply)
  }

}
