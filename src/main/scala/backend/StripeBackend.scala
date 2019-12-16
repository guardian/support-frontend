package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.validated._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.sqs.model.SendMessageResult
import com.stripe.model.{Charge, PaymentIntent}
import com.typesafe.scalalogging.StrictLogging
import conf.ConfigLoader._
import conf._
import model._
import model.acquisition.StripeAcquisition
import model.db.ContributionData
import model.email.ContributorRow
import model.stripe.{StripePaymentIntentRequest, _}
import play.api.libs.ws.WSClient
import services._
import util.EnvironmentBasedBuilder
import scala.collection.JavaConverters._

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
  // Legacy handler for the Stripe Charges API
  def createCharge(chargeData: LegacyStripeChargeRequest, clientBrowserInfo: ClientBrowserInfo): EitherT[Future, StripeApiError, StripeCreateChargeResponse] =
    stripeService.createCharge(chargeData)
      .leftMap(err => {
        logger.error(s"unable to create Stripe charge ($chargeData)", err)
        cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
        err
      })
      .semiflatMap { charge =>

        cloudWatchService.recordPaymentSuccess(PaymentProvider.Stripe)

        getOrCreateIdentityIdFromEmail(chargeData.paymentData.email.value).map { identityIdWithGuestAccountCreationToken =>
          postPaymentTasks(chargeData.paymentData.email.value, chargeData, charge, clientBrowserInfo, identityIdWithGuestAccountCreationToken.map(_.identityId))

          StripeCreateChargeResponse.fromCharge(
            charge,
            identityIdWithGuestAccountCreationToken.flatMap(_.guestAccountCreationToken)
          )
        }
      }

  def processRefundHook(refundHook: StripeRefundHook): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(refundHook)
      dbUpdateResult <- flagContributionAsRefunded(refundHook.data.`object`.id)
    } yield dbUpdateResult
  }

  def createPaymentIntent(
    request: StripePaymentIntentRequest.CreatePaymentIntent,
    clientBrowserInfo: ClientBrowserInfo): EitherT[Future, StripeApiError, StripePaymentIntentsApiResponse] = {

    stripeService.createPaymentIntent(request)
      .leftMap(err => {
        logger.error(s"Unable to create Stripe Payment Intent ($request)", err)
        cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
        err
      })
      .flatMap { paymentIntent =>

        //https://stripe.com/docs/payments/intents#intent-statuses
        paymentIntent.getStatus match {
          case "requires_action" =>
            //3DS required, return the clientSecret to the client
            EitherT.fromEither(Right(StripePaymentIntentsApiResponse.RequiresAction(paymentIntent.getClientSecret)))

          case "succeeded" =>
            //Payment complete without the need for 3DS - do post-payment tasks and return success to client
            EitherT.liftF(paymentIntentSucceeded(request, paymentIntent, clientBrowserInfo))

          case otherStatus =>
            logger.error(s"Unexpected status on Stripe Payment Intent: $otherStatus. Request was $request")
            EitherT.fromEither(Left(StripeApiError.fromString(s"Unexpected status on Stripe Payment Intent: $otherStatus")))
        }
      }
  }

  def confirmPaymentIntent(
    request: StripePaymentIntentRequest.ConfirmPaymentIntent,
    clientBrowserInfo: ClientBrowserInfo): EitherT[Future, StripeApiError, StripePaymentIntentsApiResponse.Success] = {

    stripeService.confirmPaymentIntent(request)
      .leftMap(err => {
        logger.error(s"Unable to confirm Stripe Payment Intent ($request)", err)
        cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
        err
      })
      .flatMap { paymentIntent =>
        //At this point we expect the PaymentIntent to have been ready for confirmation. Status should be 'succeeded'
        paymentIntent.getStatus match {
          case "succeeded" => EitherT.liftF(paymentIntentSucceeded(request, paymentIntent, clientBrowserInfo))

          case otherStatus =>
            logger.error(s"Unexpected status on Stripe Payment Intent: $otherStatus. Request was $request")
            EitherT.fromEither(Left(StripeApiError.fromString(s"Unexpected status on Stripe Payment Intent: $otherStatus")))
        }
      }
  }

  private def paymentIntentSucceeded(
    request: StripeRequest,
    paymentIntent: PaymentIntent,
    clientBrowserInfo: ClientBrowserInfo): Future[StripePaymentIntentsApiResponse.Success] = {

    cloudWatchService.recordPaymentSuccess(PaymentProvider.Stripe)

    getOrCreateIdentityIdFromEmail(request.paymentData.email.value).map { identityIdWithGuestAccountCreationToken =>
      paymentIntent.getCharges.getData.asScala.toList.headOption match {
        case Some(charge) =>
          postPaymentTasks(request.paymentData.email.value, request, charge, clientBrowserInfo, identityIdWithGuestAccountCreationToken.map(_.identityId))
        case None =>
          /**
            * This should never happen, but in case it does we still return success to the client because the payment
            * was reported as successful by Stripe. It does however prevent us from executing post-payment tasks and so
            * would need investigation.
            */
          cloudWatchService.recordPostPaymentTasksError(PaymentProvider.Stripe)
          logger.error(s"No charge found on completed Stripe Payment Intent, cannot do post-payment tasks. Request was $request")
      }

      StripePaymentIntentsApiResponse.Success(
        identityIdWithGuestAccountCreationToken.flatMap(_.guestAccountCreationToken)
      )
    }
  }

  private def postPaymentTasks(email: String, chargeData: StripeRequest, charge: Charge, clientBrowserInfo: ClientBrowserInfo, identityId: Option[Long]): Unit = {
    trackContribution(charge, chargeData, identityId, clientBrowserInfo).leftMap { err =>
      logger.error(s"unable to track contribution due to error: ${err.getMessage}")
    }

    identityId.foreach { id =>
      sendThankYouEmail(email, chargeData, id).leftMap { err =>
        logger.error(s"unable to send thank you email: ${err.getMessage}")
      }
    }
  }

  private def trackContribution(charge: Charge, data: StripeRequest, identityId: Option[Long], clientBrowserInfo: ClientBrowserInfo): EitherT[Future, BackendError, Unit]  =
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

  private def sendThankYouEmail(email: String, data: StripeRequest, identityId: Long): EitherT[Future, BackendError, SendMessageResult] = {
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

