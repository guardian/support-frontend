package backend

import org.apache.pekko.actor.ActorSystem
import cats.data.{EitherT, OptionT}
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.either._
import cats.syntax.validated._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService.Sources
import com.gu.support.config.Stages.{CODE, PROD}
import com.paypal.api.payments.Payment
import com.typesafe.scalalogging.StrictLogging
import conf.ConfigLoader._
import conf._
import model.Environment.Live
import model._
import model.acquisition.{AcquisitionDataRowBuilder, PaypalAcquisition}
import model.db.ContributionData
import model.email.ContributorRow
import model.paypal.PaypalApiError.paypalErrorText
import model.paypal._
import org.apache.pekko.http.scaladsl.model.Uri
import play.api.libs.ws.WSClient
import services._
import software.amazon.awssdk.services.s3.S3Client
import util.EnvironmentBasedBuilder

import scala.concurrent.Future
import scala.jdk.CollectionConverters._
import scala.util.Try

class PaypalBackend(
    paypalService: PaypalService,
    val databaseService: ContributionsStoreService,
    identityService: IdentityService,
    val acquisitionsEventBusService: AcquisitionsEventBusService,
    emailService: EmailService,
    cloudWatchService: CloudWatchService,
    val supporterProductDataService: SupporterProductDataService,
    val switchService: SwitchService,
)(implicit pool: DefaultThreadPool)
    extends StrictLogging
    with PaymentBackend {

  /*
   * Used by web clients.
   * Creates a payment which must be authorised by the user via PayPal's web UI.
   * Once authorised, the payment can be executed via the execute-payment endpoint.
   */

  private def paypalEnabled = {
    switchService.allSwitches.map(_.oneOffPaymentMethods.exists(_.switches.payPal.exists(_.state.isOn)))
  }
  def isValidEmail(email: String): Boolean =
    !email.contains(",")

  private def extractEmail(url: String): EitherT[Future, PaypalApiError, String] =
    Uri(url).query().getAll("email") match {
      case email :: Nil => EitherT.rightT(email)
      case _ => EitherT.leftT(PaypalApiError.fromString("Missing or multiple email addresses"))
    }

  def createPayment(c: CreatePaypalPaymentData): EitherT[Future, PaypalApiError, Payment] = {
    for {
      email <- extractEmail(c.returnURL)
      _ <-
        if (isValidEmail(email))
          EitherT.rightT[Future, PaypalApiError](())
        else
          EitherT.leftT(PaypalApiError.fromString("Invalid email address"))
      isPaypalEnabled <- paypalEnabled
      _ <-
        if (isPaypalEnabled)
          EitherT.rightT[Future, PaypalApiError](())
        else
          EitherT.leftT(PaypalApiError.fromString(paypalErrorText))
      payment <- paypalService
        .createPayment(c)
        .leftMap { error =>
          cloudWatchService.recordFailedPayment(error, PaymentProvider.Paypal)
          error
        }
    } yield payment
  }

  def executePayment(
      executePaymentData: ExecutePaypalPaymentData,
      clientBrowserInfo: ClientBrowserInfo,
  ): EitherT[Future, PaypalApiError, EnrichedPaypalPayment] = {
    if (isValidEmail(executePaymentData.email))
      paypalService
        .executePayment(executePaymentData)
        .leftMap(err => {
          cloudWatchService.recordFailedPayment(err, PaymentProvider.Paypal)
          err
        })
        .semiflatMap { payment =>
          cloudWatchService.recordPaymentSuccess(PaymentProvider.Paypal)

          getOrCreateIdentityIdFromEmail(executePaymentData.email).map { identityUserDetails =>
            postPaymentTasks(
              payment,
              executePaymentData.email,
              identityUserDetails.map(_.id),
              executePaymentData.acquisitionData,
              clientBrowserInfo,
              executePaymentData.similarProductsConsent,
            )

            EnrichedPaypalPayment(payment, Some(executePaymentData.email), identityUserDetails.map(_.userType))
          }
        }
    else
      EitherT.leftT(PaypalApiError.fromString("Invalid email address"))
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
      identityId: Option[String],
      acquisitionData: AcquisitionData,
      clientBrowserInfo: ClientBrowserInfo,
      similarProductsConsent: Option[Boolean],
  ): Unit = {
    trackContribution(payment, acquisitionData, email, identityId, clientBrowserInfo, similarProductsConsent)
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
      identityId: Option[String],
      clientBrowserInfo: ClientBrowserInfo,
      similarProductsConsent: Option[Boolean],
  ): Future[List[BackendError]] = {
    ContributionData.fromPaypalCharge(
      payment,
      email,
      identityId,
      clientBrowserInfo.countrySubdivisionCode,
      acquisitionData.postalCode,
    ) match {
      case Left(err) => Future.successful(List(BackendError.fromPaypalAPIError(err)))
      case Right(contributionData) =>
        val paypalAcquisition =
          PaypalAcquisition(payment, acquisitionData, contributionData.identityId, clientBrowserInfo)

        track(
          acquisition =
            AcquisitionDataRowBuilder.buildFromPayPal(paypalAcquisition, contributionData, similarProductsConsent),
          contributionData,
        )
    }
  }

  private def getOrCreateIdentityIdFromEmail(email: String): Future[Option[IdentityUserDetails]] =
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
      identityId: String,
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
      acquisitionsEventBusService: AcquisitionsEventBusService,
      emailService: EmailService,
      cloudWatchService: CloudWatchService,
      supporterProductDataService: SupporterProductDataService,
      switchService: SwitchService,
  )(implicit pool: DefaultThreadPool): PaypalBackend = {
    new PaypalBackend(
      paypalService,
      databaseService,
      identityService,
      acquisitionsEventBusService,
      emailService,
      cloudWatchService,
      supporterProductDataService,
      switchService,
    )
  }

  class Builder(configLoader: ConfigLoader, cloudWatchAsyncClient: AmazonCloudWatchAsync)(implicit
      defaultThreadPool: DefaultThreadPool,
      paypalThreadPool: PaypalThreadPool,
      sqsThreadPool: SQSThreadPool,
      wsClient: WSClient,
      s3Client: S3Client,
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
      AcquisitionsEventBusService(Sources.paymentApi, if (env == Live) PROD else CODE).valid,
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService],
      new SupporterProductDataService(env).valid: InitializationResult[SupporterProductDataService],
      new SwitchService(env)(s3Client, system, paypalThreadPool).valid: InitializationResult[SwitchService],
    ).mapN(PaypalBackend.apply)
  }
}
