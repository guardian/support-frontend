package backend

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.amazon.pay.response.ipn.model.{Notification, NotificationType, RefundNotification}
import com.amazon.pay.response.model.{AuthorizationDetails, OrderReferenceDetails, Status}
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.support.acquisitions._
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.gu.support.config.Stages.{CODE, PROD}
import com.typesafe.scalalogging.StrictLogging
import conf.AcquisitionsStreamConfigLoader.acquisitionsStreamec2OrLocalConfigLoader
import conf.ConfigLoader.environmentShow
import conf._
import model.Environment.Live
import model._
import model.acquisition.{AcquisitionDataRowBuilder, AmazonPayAcquisition}
import model.amazonpay.AmazonPayApiError.amazonPayErrorText
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError, AmazonPaymentData}
import model.db.ContributionData
import model.email.ContributorRow
import play.api.libs.ws.WSClient
import services._
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

class AmazonPayBackend(
    cloudWatchService: CloudWatchService,
    service: AmazonPayService,
    identityService: IdentityService,
    emailService: EmailService,
    val acquisitionsEventBusService: AcquisitionsEventBusService,
    val acquisitionsStreamService: AcquisitionsStreamService,
    val databaseService: ContributionsStoreService,
    val supporterProductDataService: SupporterProductDataService,
    val softOptInsService: SoftOptInsService,
    val switchService: SwitchService,
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

    def getAuthorizationDetails: Either[AmazonPayApiError, AuthorizationDetails] = for {
      orderRef <- service.getOrderReference(amazonPayRequest.paymentData.orderReferenceId)
      _ <-
        if (isNotSuspended(orderRef)) service.setOrderReference(amazonPayRequest.paymentData) else Right(orderRef)
      _ <- service.confirmOrderReference(orderRef)
      authRes <- service.authorize(orderRef, amazonPayRequest.paymentData)
      _ <- handleDeclinedResponse(orderRef, authRes.getAuthorizationStatus)
    } yield authRes

    amazonPayEnabled.flatMap {
      case true =>
        handleResponse(getAuthorizationDetails, amazonPayRequest, clientBrowserInfo)
      case false =>
        handleResponse(
          Either.left(AmazonPayApiError.fromString(amazonPayErrorText)),
          amazonPayRequest,
          clientBrowserInfo,
        )
    }
  }

  private def handleResponse(
      response: Either[AmazonPayApiError, AuthorizationDetails],
      amazonPayRequest: AmazonPayRequest,
      clientBrowserInfo: ClientBrowserInfo,
  ): EitherT[Future, AmazonPayApiError, Unit] = {
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
      acquisitionData.acquisitionData.flatMap(_.postalCode),
    )

    track(
      acquisition = AcquisitionDataRowBuilder.buildFromAmazonPay(acquisitionData, contributionData),
      contributionData,
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
      acquisitionsEventBusService: AcquisitionsEventBusService,
      acquisitionsStreamService: AcquisitionsStreamService,
      emailService: EmailService,
      cloudWatchService: CloudWatchService,
      supporterProductDataService: SupporterProductDataService,
      softOptInsService: SoftOptInsService,
      switchService: SwitchService,
  )(implicit pool: DefaultThreadPool): AmazonPayBackend = {
    new AmazonPayBackend(
      cloudWatchService,
      amazonPayService,
      identityService,
      emailService,
      acquisitionsEventBusService,
      acquisitionsStreamService,
      databaseService,
      supporterProductDataService,
      softOptInsService,
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
      AcquisitionsEventBusService("payment-api", if (env == Live) PROD else CODE).valid,
      configLoader
        .loadConfig[Environment, AcquisitionsStreamEc2OrLocalConfig](env)
        .map(new AcquisitionsStreamServiceImpl(_)): InitializationResult[AcquisitionsStreamService],
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService],
      new SupporterProductDataService(env).valid: InitializationResult[SupporterProductDataService],
      SoftOptInsService(env).valid: InitializationResult[SoftOptInsService],
      new SwitchService(env)(awsClient, system, defaultThreadPool).valid: InitializationResult[SwitchService],
    ).mapN(AmazonPayBackend.apply)
  }
}
