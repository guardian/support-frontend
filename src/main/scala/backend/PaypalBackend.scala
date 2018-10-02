package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import cats.syntax.either._
import cats.syntax.validated._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.sqs.model.SendMessageResult
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
import scala.collection.JavaConverters._

class PaypalBackend(
    paypalService: PaypalService,
    databaseService: DatabaseService,
    identityService: IdentityService,
    ophanService: OphanService,
    emailService: EmailService,
    cloudWatchService: CloudWatchService
)(implicit pool: DefaultThreadPool) extends StrictLogging {

  /*
   * Used by web clients.
   * Creates a payment which must be authorised by the user via PayPal's web UI.
   * Once authorised, the payment can be executed via the execute-payment endpoint.
   */
  def createPayment(c: CreatePaypalPaymentData): EitherT[Future, PaypalApiError, Payment] =
    paypalService.createPayment(c)
      .leftMap { error =>
        logger.error(s"Error creating paypal payment data. Error: $error")
        error
      }


  /*
   * Used by Android app clients.
   * The Android app creates and approves the payment directly via PayPal.
   * Funds are captured via this endpoint.
   */
  def capturePayment(c: CapturePaypalPaymentData, countrySubdivisionCode: Option[String]): EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    paypalService.capturePayment(c)
      .bimap(
        err => {
          cloudWatchService.recordFailedPayment(err, PaymentProvider.Paypal)
          err
        },
        payment => {
          cloudWatchService.recordPaymentSuccess(PaymentProvider.Paypal)
          val enrichedPaypalPayment = EnrichedPaypalPayment.create(payment, c.signedInUserEmail)
          postPaymentTasks(enrichedPaypalPayment, c.acquisitionData, countrySubdivisionCode)
            .leftMap { err =>
              cloudWatchService.recordPostPaymentTasksError(PaymentProvider.Paypal)
              logger.error(s"Didn't complete post-payment tasks after capturing PayPal payment. " +
                s"Payment: ${payment.toString}. " +
                s"Error(s): ${err.getMessage}")

              err
            }
          enrichedPaypalPayment
        }
      )

  def executePayment(e: ExecutePaypalPaymentData, countrySubdivisionCode: Option[String]): EitherT[Future, PaypalApiError, EnrichedPaypalPayment] =
    paypalService.executePayment(e)
      .bimap(
        err => {
          cloudWatchService.recordFailedPayment(err, PaymentProvider.Paypal)
          err
        },
        payment => {
          val enrichedPaypalPayment = EnrichedPaypalPayment.create(payment, e.signedInUserEmail)
          cloudWatchService.recordPaymentSuccess(PaymentProvider.Paypal)
          postPaymentTasks(enrichedPaypalPayment, e.acquisitionData, countrySubdivisionCode)
            .leftMap {
              err => {
                cloudWatchService.recordPostPaymentTasksError(PaymentProvider.Paypal)
                logger.error(s"Didn't complete post-payment tasks after executing PayPal payment. " +
                  s"Payment: ${payment.toString}. " +
                  s"Error(s): ${err.getMessage}")

                err
              }
            }

          enrichedPaypalPayment
        }
      )

  def processRefundHook(data: PaypalRefundWebHookData): EitherT[Future, BackendError, Unit] = {
    for {
      _ <- validateRefundHook(data.headers, data.body.rawBody)
      dbUpdateResult <- flagContributionAsRefunded(data.body.parentPaymentId)
    } yield dbUpdateResult
  }

  def getEmail(enrichedPaypalPayment: EnrichedPaypalPayment): Either[BackendError, String] = {
    Either.fromOption(
      enrichedPaypalPayment.email,
      BackendError.fromPaypalAPIError(PaypalApiError.fromString("Could not get email from payment object in PayPal SDK"))
    )
  }

  // Success or failure of these steps shouldn't affect the response to the client
  private def postPaymentTasks(enrichedPayment: EnrichedPaypalPayment, acquisitionData: AcquisitionData, countrySubdivisionCode: Option[String]): EitherT[Future, BackendError, Unit] = {
    val payment = enrichedPayment.payment
    EitherT.fromEither(getEmail(enrichedPayment)).flatMap { email =>

      val identityIdM = getOrCreateIdentityIdFromEmail(email)

      val trackContributionResult: EitherT[Future, BackendError, Unit] = identityIdM
        .flatMap { identityId =>
          trackContribution(payment, acquisitionData, email, Option(identityId), countrySubdivisionCode)
        }
        .leftMap { err =>
          logger.warn(s"unable to get identity id for email $email, tracking acquisition anyway")
          trackContribution(payment, acquisitionData, email, identityId = None, countrySubdivisionCode)
            .leftMap(trackErr => logger.error(s"unable to track contribution due to error: ${trackErr.getMessage}"))
          err
        }

      val sendThankYouEmailResult = for {
        identityId <- identityIdM
        currency <- currencyFromPayment(payment)
        _ <- sendThankYouEmail(email, currency, identityId)
      } yield ()

      BackendError.combineResults(
        trackContributionResult,
        sendThankYouEmailResult
      )
    }
  }

  private def trackContribution(payment: Payment, acquisitionData: AcquisitionData, email: String, identityId: Option[Long], countrySubdivisionCode: Option[String]): EitherT[Future, BackendError, Unit] = {
    ContributionData.fromPaypalCharge(payment, email, identityId, countrySubdivisionCode)
      .leftMap { error =>
        logger.error(s"Error creating contribution data from paypal. Error: $error")
        BackendError.fromPaypalAPIError(error)
      }
      .toEitherT[Future]
      .flatMap { contributionData =>
        BackendError.combineResults(
          submitAcquisitionToOphan(payment, acquisitionData, contributionData.identityId),
          insertContributionDataIntoDatabase(contributionData)
        )
      }
      .leftMap { err =>
        logger.error("Error tracking contribution", err)
        err
      }
  }


  private def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, Long] =
    identityService.getOrCreateIdentityIdFromEmail(email)
      .leftMap { err =>
        logger.error("Error getting identityId", err.getMessage)
        BackendError.fromIdentityError(err)
      }

  private def insertContributionDataIntoDatabase(contributionData: ContributionData): EitherT[Future, BackendError, Unit] = {
    // log so that if something goes wrong we can reconstruct the missing data from the logs
    logger.info(s"about to insert contribution into database: $contributionData")
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)
  }

  private def submitAcquisitionToOphan(payment: Payment, acquisitionData: AcquisitionData, identityId: Option[Long]): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(PaypalAcquisition(payment, acquisitionData, identityId))
      .bimap(BackendError.fromOphanError, _ => ())

  private def validateRefundHook(headers: Map[String, String], rawJson: String): EitherT[Future, BackendError, Unit] =
    paypalService.validateWebhookEvent(headers, rawJson)
      .leftMap(BackendError.fromPaypalAPIError)

  private def flagContributionAsRefunded(paypalPaymentId: String): EitherT[Future, BackendError, Unit] =
    databaseService.flagContributionAsRefunded(paypalPaymentId)
      .leftMap(BackendError.fromDatabaseError)

  private def sendThankYouEmail(email: String, currency: String, identityId: Long): EitherT[Future, BackendError, SendMessageResult] =
    emailService.sendThankYouEmail(email, currency, identityId)
      .leftMap(BackendError.fromEmailError)

  private def currencyFromPayment(p: Payment): EitherT[Future, BackendError, String] =
    Either.catchNonFatal(p.getTransactions.asScala.head.getAmount.getCurrency)
      .leftMap(error => {
        logger.error("Could not get currency from payment object in PayPal SDK", error)
        BackendError.fromPaypalAPIError(PaypalApiError.fromThrowable(error))
      }).toEitherT

}

object PaypalBackend {

  private def apply(
      paypalService: PaypalService,
      databaseService: DatabaseService,
      identityService: IdentityService,
      ophanService: OphanService,
      emailService: EmailService,
      cloudWatchService: CloudWatchService
  )(implicit pool: DefaultThreadPool): PaypalBackend = {
    new PaypalBackend(paypalService, databaseService, identityService, ophanService, emailService, cloudWatchService)
  }

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider, cloudWatchAsyncClient: AmazonCloudWatchAsync)(
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
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService]
    ).mapN(PaypalBackend.apply)
  }
}

