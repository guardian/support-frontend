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
import model.stripe._
import play.api.libs.ws.WSClient
import services.IdentityClient.UserSignInDetailsResponse.UserSignInDetails
import services._
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

// Provides methods required by the Stripe controller
class StripeBackend(
                     stripeService: StripeService,
                     databaseService: ContributionsStoreService,
                     identityService: IdentityService,
                     ophanService: AnalyticsService,
                     emailService: EmailService,
                     cloudWatchService: CloudWatchService
)(implicit pool: DefaultThreadPool) extends StrictLogging {

  // Ok using the default thread pool - the mapping function is not computationally intensive, nor does is perform IO.
  def createCharge(chargeData: StripeChargeData, clientBrowserInfo: ClientBrowserInfo): EitherT[Future, StripeApiError, StripeCreateChargeResponse] =
    stripeService.createCharge(chargeData)
      .leftMap(err => {
        logger.error(s"unable to create Stripe charge ($chargeData)", err)
        cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
        err
      })
      .semiflatMap { charge =>

        cloudWatchService.recordPaymentSuccess(PaymentProvider.Stripe)

        val identityIdWithGuestAccountCreationTokenFuture = getOrCreateIdentityIdFromEmail(chargeData.paymentData.email)
        val userSignInDetailsFuture = getUserSignInDetailsFromEmail(chargeData.paymentData.email)

        for {
          identityIdWithGuestAccountCreationToken <- identityIdWithGuestAccountCreationTokenFuture
          userSignInDetails <- userSignInDetailsFuture
        } yield {
          postPaymentTasks(chargeData.paymentData.email, chargeData, charge, clientBrowserInfo, identityIdWithGuestAccountCreationToken.map(_.identityId))

          StripeCreateChargeResponse.fromCharge(
            charge,
            identityIdWithGuestAccountCreationToken.flatMap(_.guestAccountCreationToken),
            userSignInDetails
          )
        }
      }

  def processRefundHook(refundHook: StripeRefundHook): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(refundHook)
      dbUpdateResult <- flagContributionAsRefunded(refundHook.data.`object`.id)
    } yield dbUpdateResult
  }

  private def postPaymentTasks(email: String, chargeData: StripeChargeData, charge: Charge, clientBrowserInfo: ClientBrowserInfo, identityId: Option[Long]): Unit = {
    trackContribution(charge, chargeData, identityId, clientBrowserInfo).leftMap { err =>
      logger.error(s"unable to track contribution due to error: ${err.getMessage}")
    }

    identityId.foreach { id =>
      sendThankYouEmail(email, chargeData, id).leftMap { err =>
        logger.error(s"unable to send thank you email: ${err.getMessage}")
      }
    }
  }

  private def trackContribution(charge: Charge, data: StripeChargeData, identityId: Option[Long], clientBrowserInfo: ClientBrowserInfo): EitherT[Future, BackendError, Unit]  =
    BackendError.combineResults(
      insertContributionDataIntoDatabase(
        ContributionData.fromStripeCharge(
          identityId,
          charge,
          clientBrowserInfo.countrySubdivisionCode,
          PaymentProvider.fromStripePaymentMethod(data.paymentData.stripePaymentMethod)
        )
      ),
      submitAcquisitionToOphan(StripeAcquisition(data, charge, identityId, clientBrowserInfo))
    )

  private def getOrCreateIdentityIdFromEmail(email: String): Future[Option[IdentityIdWithGuestAccountCreationToken]] =
    identityService.getOrCreateIdentityIdFromEmail(email).fold(
      err => {
        logger.warn(s"unable to get identity id for email $email, tracking acquisition anyway. Error: ${err.getMessage}")
        None
      },
      identityIdWithGuestAccountCreationToken => Some(identityIdWithGuestAccountCreationToken)
    )

  private def getUserSignInDetailsFromEmail(email: String): Future[Option[UserSignInDetails]] =
    identityService.getUserSignInDetailsFromEmail(email).fold(
      err => {
        logger.warn(s"unable to get sign in details for email $email, tracking acquisition anyway. Error: ${err.getMessage}")
        None
      },
      userSignInDetails => Some(userSignInDetails)
    )

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
                     databaseService: ContributionsStoreService,
                     identityService: IdentityService,
                     ophanService: AnalyticsService,
                     emailService: EmailService,
                     cloudWatchService: CloudWatchService
  )(implicit pool: DefaultThreadPool): StripeBackend = {
    new StripeBackend(stripeService, databaseService, identityService, ophanService, emailService, cloudWatchService)
  }

  class Builder(configLoader: ConfigLoader, cloudWatchAsyncClient: AmazonCloudWatchAsync)(
    implicit defaultThreadPool: DefaultThreadPool,
    stripeThreadPool: StripeThreadPool,
    sqsThreadPool: SQSThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[StripeBackend] {

    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader
        .loadConfig[Environment, StripeConfig](env)
        .map(StripeService.fromStripeConfig): InitializationResult[StripeService],
      configLoader
        .loadConfig[Environment, ContributionsStoreQueueConfig](env)
        .andThen(ContributionsStoreQueueService.fromContributionsStoreQueueConfig): InitializationResult[ContributionsStoreQueueService],
      configLoader
        .loadConfig[Environment, IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService],
      services.AnalyticsService(configLoader, env),
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService]
    ).mapN(StripeBackend.apply)
  }
}

