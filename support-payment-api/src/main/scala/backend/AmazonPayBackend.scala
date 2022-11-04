package backend

import akka.actor.ActorSystem
import com.amazonaws.services.s3.AmazonS3
import cats.data.EitherT
import cats.implicits._
import com.amazon.pay.response.ipn.model.{Notification, NotificationType, RefundNotification}
import com.amazon.pay.response.model.{AuthorizationDetails, OrderReferenceDetails, Status}
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.support.acquisitions.ga.GoogleAnalyticsService
import com.gu.support.acquisitions.{AcquisitionsStreamEc2OrLocalConfig, AcquisitionsStreamService, AcquisitionsStreamServiceImpl, BigQueryConfig, BigQueryService}
import com.typesafe.scalalogging.StrictLogging
import conf.BigQueryConfigLoader.bigQueryConfigParameterStoreLoadable
import conf.AcquisitionsStreamConfigLoader.acquisitionsStreamec2OrLocalConfigLoader
import conf.ConfigLoader.environmentShow
import conf._
import model._
import model.acquisition.{AcquisitionDataRowBuilder, AmazonPayAcquisition}
import model.amazonpay.AmazonPayApiError.amazonPayErrorText
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError, AmazonPaymentData}
import model.db.ContributionData
import model.email.ContributorRow
import play.api.libs.ws.WSClient
import services.{CloudWatchService, _}
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

class AmazonPayBackend(
    cloudWatchService: CloudWatchService,
    service: AmazonPayService,
    identityService: IdentityService,
    emailService: EmailService,
    val gaService: GoogleAnalyticsService,
    val bigQueryService: BigQueryService,
    val acquisitionsStreamService: AcquisitionsStreamService,
    val databaseService: ContributionsStoreService,
    switchService:SwitchService,
)(implicit pool: DefaultThreadPool)
    extends StrictLogging
    with PaymentBackend {

    private def amazonPayEnabled =
    switchService.allSwitches.map(switch => switch.oneOffPaymentMethods.exists(s => s.switches.amazonPay.state.isOn))


  def makePayment(
      amazonPayRequest: AmazonPayRequest,
      clientBrowserInfo: ClientBrowserInfo,
  ): EitherT[Future, AmazonPayApiError, Unit] = {

    def isNotSuspended(details: OrderReferenceDetails) =
      details.getOrderReferenceStatus.getState.toUpperCase != "SUSPENDED"

    def handleDeclinedResponse(orderRef: OrderReferenceDetails, authStatus: Status) = {
      val isDeclined = authStatus.getState.toUpperCase == "DECLINED"
      if (isDeclined && authStatus.getReasonCode == "TransactionTimedOut") {
        logger.warn(s"Cancelling ${orderRef.getAmazonOrderReferenceId} due to TransactionTimedOut")
        service.cancelOrderReference(orderRef)
      }
      Either.cond(
        test = !isDeclined,
        right = orderRef,
        left = AmazonPayApiError
          .withReason(200, s"Declined with reason ${authStatus.getReasonCode}", authStatus.getReasonCode),
      )
    }

    val response =
          for {
            orderRef <- service.getOrderReference(amazonPayRequest.paymentData.orderReferenceId)
            _ <- if (isNotSuspended(orderRef)) service.setOrderReference(amazonPayRequest.paymentData) else Right(orderRef)
            _ <- service.confirmOrderReference(orderRef)
            authRes <- service.authorize(orderRef, amazonPayRequest.paymentData)
            _ <- handleDeclinedResponse(orderRef, authRes.getAuthorizationStatus)
          } yield authRes

   amazonPayEnabled.flatMap{
     case true=>
       handleResponse(response, amazonPayRequest, clientBrowserInfo)
     case _ =>
       handleResponse(Either.left(AmazonPayApiError.fromString(amazonPayErrorText)), amazonPayRequest, clientBrowserInfo)

   }

  }

  private def handleResponse(
      response: Either[AmazonPayApiError, AuthorizationDetails],
      amazonPayRequest: AmazonPayRequest,
      clientBrowserInfo: ClientBrowserInfo,
  ): EitherT[Future, AmazonPayApiError, Unit] =
    response
      .toEitherT[Future]
      .leftMap { error =>
        logger.info(
          s"Something went wrong with AmazonPay orderReferenceId: ${amazonPayRequest.paymentData.orderReferenceId}",
        )
        cloudWatchService.recordFailedPayment(error, PaymentProvider.AmazonPay)
        error
      }
      .semiflatMap { authDetails =>
        val email = amazonPayRequest.paymentData.email
        val countryCode = "US"
        service.close(amazonPayRequest.paymentData)
        cloudWatchService.recordPaymentSuccess(PaymentProvider.AmazonPay)

        getOrCreateIdentityIdFromEmail(email).map { id =>
          val acquisition =
            AmazonPayAcquisition(
              amazonPayRequest.paymentData,
              amazonPayRequest.acquisitionData,
              id,
              Some(countryCode),
              clientBrowserInfo,
            )
          postPaymentTasks(authDetails, email, acquisition)
          ()
        }
      }

  private def getOrCreateIdentityIdFromEmail(email: String) =
    identityService
      .getOrCreateIdentityIdFromEmail(email)
      .fold(
        err => {
          logger
            .warn(s"Unable to get identity id for email $email, tracking acquisition anyway. Error: ${err.getMessage}")
          None
        },
        identityIdWithGuestAccountCreationToken => Some(identityIdWithGuestAccountCreationToken),
      )

  private def postPaymentTasks(
      authDetails: AuthorizationDetails,
      email: String,
      acquisitionData: AmazonPayAcquisition,
  ): Unit = {
    val clientBrowserInfo = acquisitionData.clientBrowserInfo
    val identityId = acquisitionData.identityId
    trackContribution(authDetails, acquisitionData, email, identityId, clientBrowserInfo)
      .map(errors =>
        cloudWatchService.recordPostPaymentTasksErrors(
          PaymentProvider.AmazonPay,
          errors,
        ),
      )

    identityId.foreach { id =>
      sendThankYouEmail(email, acquisitionData.amazonPayment, id).leftMap { err =>
        cloudWatchService.recordPostPaymentTasksError(
          PaymentProvider.AmazonPay,
          s"unable to send thank you email: ${err.getMessage}",
        )
      }
    }
  }

  private def trackContribution(
      payment: AuthorizationDetails,
      acquisitionData: AmazonPayAcquisition,
      email: String,
      identityId: Option[Long],
      clientBrowserInfo: ClientBrowserInfo,
  ): Future[List[BackendError]] = {
    val contributionData = ContributionData.fromAmazonPay(
      payment,
      identityId,
      email,
      acquisitionData.countryCode,
      clientBrowserInfo.countrySubdivisionCode,
      acquisitionData.amazonPayment.orderReferenceId,
    )
    val gaData = ClientBrowserInfo.toGAData(clientBrowserInfo)

    track(
      acquisition = AcquisitionDataRowBuilder.buildFromAmazonPay(acquisitionData, contributionData),
      contributionData,
      gaData,
    )
  }

  private def sendThankYouEmail(
      email: String,
      payment: AmazonPaymentData,
      identityId: Long,
  ): EitherT[Future, BackendError, SendMessageResult] = {
    val contributorRow =
      ContributorRow(email, payment.currency.toString, identityId, PaymentProvider.AmazonPay, None, payment.amount)

    emailService.sendThankYouEmail(contributorRow).leftMap(BackendError.fromEmailError)
  }

  def handleNotification(notification: Notification): EitherT[Future, Throwable, Unit] = {
    logger.info(s"Checking notification type")
    notification.getNotificationType match {
      case NotificationType.RefundNotification =>
        val refundId = notification.asInstanceOf[RefundNotification].getRefundDetails.getAmazonRefundId
        logger.info(s"Processing refund $refundId ")
        val orderRef = refundIdToOrderRef(refundId)
        logger.info(s"Derived order ref $orderRef ")
        flagContributionAsRefunded(
          orderRef,
        ).leftWiden // This allows BackendError (a subtype of Throwable) to be widened to satisfy eitherTs invariance
      case _ =>
        // Ignore any other notifications
        EitherT.rightT(())
    }
  }

  def refundIdToOrderRef(refundId: String): String =
    refundId.take(19) // The orderReference is the first 19 chars of the refundReference

  private def flagContributionAsRefunded(id: String): EitherT[Future, BackendError, Unit] =
    databaseService
      .flagContributionAsRefunded(id)
      .leftMap(BackendError.fromDatabaseError)
}

object AmazonPayBackend {

  private def apply(
      amazonPayService: AmazonPayService,
      databaseService: ContributionsStoreService,
      identityService: IdentityService,
      gaService: GoogleAnalyticsService,
      bigQueryService: BigQueryService,
      acquisitionsStreamService: AcquisitionsStreamService,
      emailService: EmailService,
      cloudWatchService: CloudWatchService,
      switchService:SwitchService,
  )(implicit pool: DefaultThreadPool): AmazonPayBackend = {
    new AmazonPayBackend(
      cloudWatchService,
      amazonPayService,
      identityService,
      emailService,
      gaService,
      bigQueryService,
      acquisitionsStreamService,
      databaseService,
      switchService,
    )
  }

  class Builder(configLoader: ConfigLoader, cloudWatchAsyncClient: AmazonCloudWatchAsync)(implicit
      defaultThreadPool: DefaultThreadPool,
      wsClient: WSClient,
      sqsThreadPool: SQSThreadPool,
      awsClient: AmazonS3,
      system: ActorSystem,
  ) extends EnvironmentBasedBuilder[AmazonPayBackend] {

    override def build(env: Environment): InitializationResult[AmazonPayBackend] = (
      configLoader
        .loadConfig[Environment, AmazonPayConfig](env)
        .map(AmazonPayService.fromAmazonPayConfig): InitializationResult[AmazonPayService],
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
      new SwitchService(env)(awsClient, system, defaultThreadPool).valid: InitializationResult[SwitchService],
    ).mapN(AmazonPayBackend.apply)
  }
}
