package backend

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.either._
import cats.syntax.validated._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.s3.AmazonS3
import com.gu.support.acquisitions.ga.GoogleAnalyticsService
import com.gu.support.acquisitions.{
  AcquisitionsStreamEc2OrLocalConfig,
  AcquisitionsStreamService,
  AcquisitionsStreamServiceImpl,
  BigQueryConfig,
  BigQueryService,
}
import com.paypal.api.payments.Payment
import com.typesafe.scalalogging.StrictLogging
import conf.BigQueryConfigLoader.bigQueryConfigParameterStoreLoadable
import conf.AcquisitionsStreamConfigLoader.acquisitionsStreamec2OrLocalConfigLoader
import play.api.libs.ws.WSClient
import conf._
import conf.ConfigLoader._
import model._
import model.acquisition.{AcquisitionDataRowBuilder, PaypalAcquisition}
import model.db.ContributionData
import model.email.ContributorRow
import model.paypal._
import services._
import util.EnvironmentBasedBuilder
import model.paypal.PaypalApiError.paypalErrorText

import scala.concurrent.Future
import scala.jdk.CollectionConverters._
import scala.util.Try

class PaypalBackend(
    paypalService: PaypalService,
    val databaseService: ContributionsStoreService,
    identityService: IdentityService,
    val gaService: GoogleAnalyticsService,
    val bigQueryService: BigQueryService,
    val acquisitionsStreamService: AcquisitionsStreamService,
    emailService: EmailService,
    cloudWatchService: CloudWatchService,
    switchService: SwitchService,
)(implicit pool: DefaultThreadPool)
    extends StrictLogging
    with PaymentBackend {

  /*
   * Used by web clients.
   * Creates a payment which must be authorised by the user via PayPal's web UI.
   * Once authorised, the payment can be executed via the execute-payment endpoint.
   */

  private def paypalEnabled = {
    switchService.allSwitches.map(switch => switch.oneOffPaymentMethods.exists(s => s.switches.payPal.state.isOn))
  }

  def createPayment(c: CreatePaypalPaymentData): EitherT[Future, PaypalApiError, Payment] = {
    paypalEnabled.flatMap {
      case true =>
        paypalService
          .createPayment(c)
          .leftMap { error =>
            cloudWatchService.recordFailedPayment(error, PaymentProvider.Paypal)
            error
          }
      case _ =>
        EitherT.leftT(PaypalApiError.fromString(paypalErrorText))
    }
  }

  /*
   * Used by Android app clients.
   * The Android app creates and approves the payment directly via PayPal.
   * Funds are captured via this endpoint.
   */
  def capturePayment(
      capturePaymentData: CapturePaypalPaymentData,
      clientBrowserInfo: ClientBrowserInfo,
  ): EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    paypalService
      .capturePayment(capturePaymentData)
      .bimap(
        err => {
          cloudWatchService.recordFailedPayment(err, PaymentProvider.Paypal)
          err
        },
        payment => {
          cloudWatchService.recordPaymentSuccess(PaymentProvider.Paypal)

          val maybeEmail = capturePaymentData.signedInUserEmail.orElse(
            Try(payment.getPayer.getPayerInfo.getEmail).toOption.filterNot(_.isEmpty),
          )

          maybeEmail.foreach { email =>
            getOrCreateIdentityIdFromEmail(email).foreach { identityId =>
              postPaymentTasks(payment, email, identityId, capturePaymentData.acquisitionData, clientBrowserInfo)
            }
          }

          EnrichedPaypalPayment(payment, maybeEmail)
        },
      )

  def executePayment(
      executePaymentData: ExecutePaypalPaymentData,
      clientBrowserInfo: ClientBrowserInfo,
  ): EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    paypalService
      .executePayment(executePaymentData)
      .leftMap(err => {
        cloudWatchService.recordFailedPayment(err, PaymentProvider.Paypal)
        err
      })
      .semiflatMap { payment =>
        cloudWatchService.recordPaymentSuccess(PaymentProvider.Paypal)

        getOrCreateIdentityIdFromEmail(executePaymentData.email).map { identityId =>
          postPaymentTasks(
            payment,
            executePaymentData.email,
            identityId,
            executePaymentData.acquisitionData,
            clientBrowserInfo,
          )

          EnrichedPaypalPayment(payment, Some(executePaymentData.email))
        }
      }

  def processRefundHook(data: PaypalRefundWebHookData): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(data.headers, data.body.rawBody)
      dbUpdateResult <- flagContributionAsRefunded(data.body.parentPaymentId)
    } yield dbUpdateResult
  }

  // Success or failure of these steps shouldn't affect the response to the client
  private def postPaymentTasks(
      payment: Payment,
      email: String,
      identityId: Option[Long],
      acquisitionData: AcquisitionData,
      clientBrowserInfo: ClientBrowserInfo,
  ): Unit = {
    trackContribution(payment, acquisitionData, email, identityId, clientBrowserInfo)
      .map(errors =>
        cloudWatchService.recordPostPaymentTasksErrors(
          PaymentProvider.Paypal,
          errors,
        ),
      )

    val emailResult = for {
      id <- EitherT.fromOption(
        identityId,
        BackendError.identityIdMissingError(s"no identity ID for $email"),
      )
      contributorRow <- contributorRowFromPayment(email, id, payment)
      _ <- emailService.sendThankYouEmail(contributorRow).leftMap(BackendError.fromEmailError)
    } yield ()

    emailResult.leftMap { err =>
      cloudWatchService.recordPostPaymentTasksError(
        PaymentProvider.Paypal,
        s"unable to send email: ${err.getMessage}",
      )
    }
  }

  private def trackContribution(
      payment: Payment,
      acquisitionData: AcquisitionData,
      email: String,
      identityId: Option[Long],
      clientBrowserInfo: ClientBrowserInfo,
  ): Future[List[BackendError]] = {
    ContributionData.fromPaypalCharge(payment, email, identityId, clientBrowserInfo.countrySubdivisionCode) match {
      case Left(err) => Future.successful(List(BackendError.fromPaypalAPIError(err)))
      case Right(contributionData) =>
        val paypalAcquisition =
          PaypalAcquisition(payment, acquisitionData, contributionData.identityId, clientBrowserInfo)
        val gaData = ClientBrowserInfo.toGAData(clientBrowserInfo)

        track(
          acquisition = AcquisitionDataRowBuilder.buildFromPayPal(paypalAcquisition, contributionData),
          contributionData,
          gaData,
        )
    }
  }

  private def getOrCreateIdentityIdFromEmail(email: String): Future[Option[Long]] =
    identityService
      .getOrCreateIdentityIdFromEmail(email)
      .fold(
        err => {
          logger
            .warn(s"unable to get identity id for email $email, tracking acquisition anyway. Error: ${err.getMessage}")
          None
        },
        identityIdWithGuestAccountCreationToken => Some(identityIdWithGuestAccountCreationToken),
      )

  private def validateRefundHook(headers: Map[String, String], rawJson: String): EitherT[Future, BackendError, Unit] =
    paypalService
      .validateWebhookEvent(headers, rawJson)
      .leftMap(BackendError.fromPaypalAPIError)

  private def flagContributionAsRefunded(paypalPaymentId: String): EitherT[Future, BackendError, Unit] =
    databaseService
      .flagContributionAsRefunded(paypalPaymentId)
      .leftMap(BackendError.fromDatabaseError)

  private def contributorRowFromPayment(
      email: String,
      identityId: Long,
      payment: Payment,
  ): EitherT[Future, BackendError, ContributorRow] = {

    def errorMessage(details: String) = s"contributorRowFromPayment unable to extract contributorRow, $details"

    val firstName = for {
      payer <- Option(payment.getPayer)
      info <- Option(payer.getPayerInfo)
      firstName <- Option(info.getFirstName)
    } yield firstName

    val contributorRow = for {
      transactions <- Option(payment.getTransactions).toRight(s"unable to get Transactions for $identityId")
      transaction <- transactions.asScala.headOption.toRight(s"no transactions found for $identityId")
      amount <- Try(BigDecimal(transaction.getAmount.getTotal)).toEither.leftMap(e =>
        s"unable to extract amount for $identityId ${e.getMessage}",
      )
    } yield {
      ContributorRow(email, transaction.getAmount.getCurrency, identityId, PaymentProvider.Paypal, firstName, amount)
    }

    contributorRow.left.foreach(message => logger.error(errorMessage(message)))
    EitherT.fromEither[Future](
      contributorRow.leftMap(message =>
        BackendError.fromPaypalAPIError(PaypalApiError.fromString(errorMessage(message))),
      ),
    )
  }

}

object PaypalBackend {

  private def apply(
      paypalService: PaypalService,
      databaseService: ContributionsStoreService,
      identityService: IdentityService,
      gaService: GoogleAnalyticsService,
      bigQueryService: BigQueryService,
      acquisitionsStreamService: AcquisitionsStreamService,
      emailService: EmailService,
      cloudWatchService: CloudWatchService,
      switchService: SwitchService,
  )(implicit pool: DefaultThreadPool): PaypalBackend = {
    new PaypalBackend(
      paypalService,
      databaseService,
      identityService,
      gaService,
      bigQueryService,
      acquisitionsStreamService,
      emailService,
      cloudWatchService,
      switchService,
    )
  }

  class Builder(configLoader: ConfigLoader, cloudWatchAsyncClient: AmazonCloudWatchAsync)(implicit
      defaultThreadPool: DefaultThreadPool,
      paypalThreadPool: PaypalThreadPool,
      sqsThreadPool: SQSThreadPool,
      wsClient: WSClient,
      awsClient: AmazonS3,
      system: ActorSystem,
  ) extends EnvironmentBasedBuilder[PaypalBackend] {

    override def build(env: Environment): InitializationResult[PaypalBackend] = (
      configLoader
        .loadConfig[Environment, PaypalConfig](env)
        .map(PaypalService.fromPaypalConfig): InitializationResult[PaypalService],
      configLoader
        .loadConfig[Environment, ContributionsStoreQueueConfig](env)
        .andThen(ContributionsStoreQueueService.fromContributionsStoreQueueConfig): InitializationResult[
        ContributionsStoreQueueService,
      ],
      configLoader
        .loadConfig[Environment, IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService],
      GoogleAnalyticsServices(env).valid: InitializationResult[GoogleAnalyticsService],
      configLoader
        .loadConfig[Environment, BigQueryConfig](env)
        .map(new BigQueryService(_)): InitializationResult[BigQueryService],
      configLoader
        .loadConfig[Environment, AcquisitionsStreamEc2OrLocalConfig](env)
        .map(new AcquisitionsStreamServiceImpl(_)): InitializationResult[AcquisitionsStreamService],
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService],
      new SwitchService(env)(awsClient, system, paypalThreadPool).valid: InitializationResult[SwitchService],
    ).mapN(PaypalBackend.apply)
  }
}
