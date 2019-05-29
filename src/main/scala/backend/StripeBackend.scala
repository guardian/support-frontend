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
import io.circe.generic.JsonCodec
import model._
import model.acquisition.StripeAcquisition
import model.db.ContributionData
import model.email.ContributorRow
import model.stripe._
import play.api.libs.ws.WSClient
import services._
import util.EnvironmentBasedBuilder

import scala.concurrent.Future


@JsonCodec case class StripeCreateChargeResponse(currency: String, amount: BigDecimal, guestAccountToken: Option[String])

object StripeCreateChargeResponse {
  def fromStripeChargeSuccessAndGuestAccountToken(stripeChargeSuccess: StripeChargeSuccess, guestAccountToken: Option[String]): StripeCreateChargeResponse = {
    StripeCreateChargeResponse(stripeChargeSuccess.currency, stripeChargeSuccess.amount, guestAccountToken)
  }
}

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
  def createCharge(data: StripeChargeData, clientBrowserInfo: ClientBrowserInfo): EitherT[Future, StripeApiError, StripeCreateChargeResponse] =
    stripeService.createCharge(data)
      .leftMap(err => {
        logger.error(s"unable to create Stripe charge ($data)", err)
        cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
        err
      })
      .flatMap(
          charge => {
            cloudWatchService.recordPaymentSuccess(PaymentProvider.Stripe)
            val email = data.signedInUserEmail.getOrElse(data.paymentData.email)
            getOrCreateIdentityIdFromEmail(email).map(
              response => {
                val stripeChargeSuccess = StripeChargeSuccess.fromCharge(charge)
                StripeCreateChargeResponse.fromStripeChargeSuccessAndGuestAccountToken(stripeChargeSuccess, response.guestAccountRegistrationToken)
              }
            )
            .recover {
              case x: BackendError => {
                val stripeChargeSuccess = StripeChargeSuccess.fromCharge(charge)
                StripeCreateChargeResponse.fromStripeChargeSuccessAndGuestAccountToken(stripeChargeSuccess, None)
              }
            }
          }
      )





      .bimap(
        err => {
          logger.error(s"unable to create Stripe charge ($data)", err)
          cloudWatchService.recordFailedPayment(err, PaymentProvider.Stripe)
          err
        },
        charge => {
          cloudWatchService.recordPaymentSuccess(PaymentProvider.Stripe)
          val email = data.signedInUserEmail.getOrElse(data.paymentData.email)



          // EitherT[Future, BackendError, IdentityIdWithGuestAccountToken]



            val result = getOrCreateIdentityIdFromEmail(email).bimap(
              err => {
                val stripeChargeSuccess = StripeChargeSuccess.fromCharge(charge)
                StripeCreateChargeResponse.fromStripeChargeSuccessAndGuestAccountToken(stripeChargeSuccess, None)
              },
              response => {
                val stripeChargeSuccess = StripeChargeSuccess.fromCharge(charge)
                StripeCreateChargeResponse.fromStripeChargeSuccessAndGuestAccountToken(stripeChargeSuccess, response.guestAccountRegistrationToken)
              }
            )




         /* postPaymentTasks(email, data, charge, clientBrowserInfo, identityIdWithGuestAccountToken.map(_.identityId))
            .leftMap { err =>
              cloudWatchService.recordPostPaymentTasksError(PaymentProvider.Stripe)
              logger.error(
                s"didn't complete post-payment tasks after creating Stripe charge - ${charge.toString}",
                err
              )
              err
            }

          val stripeChargeSuccess = StripeChargeSuccess.fromCharge(charge)
          StripeCreateChargeResponse.fromStripeChargeSuccessAndGuestAccountToken(stripeChargeSuccess, identityIdWithGuestAccountToken.flatMap(_.guestAccountRegistrationToken))*/
        }
      )

  def processRefundHook(refundHook: StripeRefundHook): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(refundHook)
      dbUpdateResult <- flagContributionAsRefunded(refundHook.data.`object`.id)
    } yield dbUpdateResult
  }


  //   val identityIdWithGuestAccountTokenMonad: EitherT[Future, BackendError, IdentityIdWithGuestAccountToken] = getOrCreateIdentityIdFromEmail(email)

  private def postPaymentTasks(email: String, data: StripeChargeData, charge: Charge, clientBrowserInfo: ClientBrowserInfo, identityId: Option[Long] ): EitherT[Future, BackendError, Unit] = {

    val trackContributionResult = {
      trackContribution(charge, data, identityId, clientBrowserInfo)
    }

    val sendThankYouEmailResult = identityId.fold(EitherT(Future.successful(Left(BackendError.identityIdMissingError("Identity Id missing")): Either[BackendError, Unit]))){id => {
      for {
        _ <- sendThankYouEmail(email, data, id)
      } yield ()
    }}


      BackendError.combineResults(
      trackContributionResult,
      sendThankYouEmailResult
    )
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

  // Convert the result of the identity id operation,
  // into the monad used by the for comprehension in the createCharge() method.
  private def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, IdentityIdWithGuestAccountToken] =
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

