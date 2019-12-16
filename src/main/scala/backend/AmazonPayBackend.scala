package backend

import cats.data.EitherT
import cats.implicits._
import com.amazon.pay.response.ipn.model.{Notification, NotificationType, RefundNotification}
import com.amazon.pay.response.model.{AuthorizationDetails, OrderReferenceDetails}
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.sqs.model.SendMessageResult
import com.typesafe.scalalogging.StrictLogging
import conf.ConfigLoader.environmentShow
import conf._
import model._
import model.acquisition.AmazonPayAcquisition
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError, AmazonPayResponse, AmazonPaymentData}
import model.db.ContributionData
import model.email.ContributorRow
import play.api.libs.ws.WSClient
import services.{CloudWatchService, _}
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

class AmazonPayBackend(cloudWatchService: CloudWatchService,
                       service: AmazonPayService,
                       identityService: IdentityService,
                       emailService: EmailService,
                       ophanService: AnalyticsService,
                       databaseService: ContributionsStoreService
                      )(implicit pool: DefaultThreadPool) extends StrictLogging {

  def makePayment(amazonPayRequest: AmazonPayRequest, clientBrowserInfo: ClientBrowserInfo): EitherT[Future, AmazonPayApiError, AmazonPayResponse] = {

    def isNotSuspended(details: OrderReferenceDetails) =  details.getOrderReferenceStatus.getState.toUpperCase != "SUSPENDED"

    def handleDeclinedResponse(orderRef: OrderReferenceDetails, authRes: AuthorizationDetails) = {
      val isDeclined = authRes.getAuthorizationStatus.getState.toUpperCase == "DECLINED"
      Either.cond(
        test = !isDeclined,
        right = orderRef,
        left = AmazonPayApiError
          .withReason(200, s"Declined with reason ${authRes.getAuthorizationStatus.getReasonCode}", authRes.getAuthorizationStatus.getReasonCode)
      )
    }

    val response = for {
      orderRef <- service.getOrderReference(amazonPayRequest.paymentData.orderReferenceId)
      _ <- if (isNotSuspended(orderRef)) service.setOrderReference(amazonPayRequest.paymentData) else Right(orderRef)
      _ <- service.confirmOrderReference(orderRef)
      authRes <- service.authorize(orderRef, amazonPayRequest.paymentData)
      _ <- handleDeclinedResponse(orderRef, authRes)
    } yield  authRes

    handleResponse(response, amazonPayRequest, clientBrowserInfo)
  }

  private def handleResponse(response: Either[AmazonPayApiError, AuthorizationDetails] , amazonPayRequest: AmazonPayRequest, clientBrowserInfo: ClientBrowserInfo)  = {
    response.toEitherT[Future]
      .leftMap { error =>
        logger.error(s"Something went wrong with ${amazonPayRequest.paymentData.orderReferenceId}: ${error.getMessage}")
        cloudWatchService.recordFailedPayment(error, PaymentProvider.AmazonPay)
        error
      }.semiflatMap { authDetails =>
        val email = amazonPayRequest.paymentData.email
        val countryCode = "US"
        service.close(amazonPayRequest.paymentData)
        cloudWatchService.recordPaymentSuccess(PaymentProvider.AmazonPay)
        getOrCreateIdentityIdFromEmail(email)
        .map { idWithToken =>
          val acquisition =
            AmazonPayAcquisition(amazonPayRequest.paymentData, amazonPayRequest.acquisitionData, idWithToken.map(_.identityId), Some(countryCode), clientBrowserInfo)
          postPaymentTasks(authDetails, email, acquisition)
          AmazonPayResponse(idWithToken.flatMap(_.guestAccountCreationToken))
        }
    }
  }

  private def getOrCreateIdentityIdFromEmail(email: String) =
    identityService.getOrCreateIdentityIdFromEmail(email)
      .fold(
        err => {
          logger.warn(s"Unable to get identity id for email $email, tracking acquisition anyway. Error: ${err.getMessage}")
          None
        },
        identityIdWithGuestAccountCreationToken => Some(identityIdWithGuestAccountCreationToken)
      )

  private def postPaymentTasks(authDetails: AuthorizationDetails, email: String, acquisitionData: AmazonPayAcquisition): Unit = {
    val clientBrowserInfo = acquisitionData.clientBrowserInfo
    val identityId = acquisitionData.identityId
    trackContribution(authDetails, acquisitionData, email, identityId, clientBrowserInfo)

    identityId.foreach { id =>
      sendThankYouEmail(email, acquisitionData.amazonPayment, id)
        .leftMap { err =>
        logger.error(s"unable to send thank you email: ${err.getMessage}")
      }
    }
  }

  private def trackContribution(payment: AuthorizationDetails, acquisitionData: AmazonPayAcquisition, email: String, identityId: Option[Long], clientBrowserInfo: ClientBrowserInfo): EitherT[Future, BackendError, Unit] = {
    val contributionData = ContributionData.fromAmazonPay(payment, identityId, email, acquisitionData.countryCode, clientBrowserInfo.countrySubdivisionCode, acquisitionData.amazonPayment.orderReferenceId)
    BackendError.combineResults(
      submitAcquisitionToOphan(acquisitionData),
      insertContributionDataIntoDatabase(contributionData)
    ).leftMap { err =>
      logger.error("Error tracking contribution", err)
      err
    }
  }

  private def insertContributionDataIntoDatabase(contributionData: ContributionData): EitherT[Future, BackendError, Unit] = {
    // log so that if something goes wrong we can reconstruct the missing data from the logs
    logger.info(s"about to insert contribution into database: $contributionData")
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)
  }

  private def submitAcquisitionToOphan(acquisition: AmazonPayAcquisition): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(acquisition)
      .bimap(BackendError.fromOphanError, _ => ())

  private def sendThankYouEmail(email: String, payment: AmazonPaymentData, identityId: Long): EitherT[Future, BackendError, SendMessageResult] = {
    val contributorRow = ContributorRow(
      email,
      payment.currency.toString,
      identityId,
      PaymentProvider.AmazonPay,
      None,
      payment.amount)

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
        flagContributionAsRefunded(orderRef).leftWiden //This allows BackendError (a subtype of Throwable) to be widened to satisfy eitherTs invariance
      case _ =>
        EitherT.leftT(BackendError.AmazonPayApiError(AmazonPayApiError(Some(503), "Something went wrong handling the refund")))
    }
  }

  def refundIdToOrderRef(refundId: String): String = refundId.take(19) //The orderReference is the first 19 chars of the refundReference

  private def flagContributionAsRefunded(id: String): EitherT[Future, BackendError, Unit] =
    databaseService.flagContributionAsRefunded(id)
      .leftMap(BackendError.fromDatabaseError)
}

object AmazonPayBackend {

  private def apply(
                    amazonPayService: AmazonPayService,
                    databaseService: ContributionsStoreService,
                    identityService: IdentityService,
                    ophanService: AnalyticsService,
                    emailService: EmailService,
                    cloudWatchService: CloudWatchService
                   )(implicit pool: DefaultThreadPool): AmazonPayBackend = {
    new AmazonPayBackend(cloudWatchService, amazonPayService, identityService, emailService, ophanService, databaseService )
  }

  class Builder(configLoader: ConfigLoader, cloudWatchAsyncClient: AmazonCloudWatchAsync)(
    implicit defaultThreadPool: DefaultThreadPool,
    wsClient: WSClient,
    sqsThreadPool: SQSThreadPool
  ) extends EnvironmentBasedBuilder[AmazonPayBackend] {

    override def build(env: Environment): InitializationResult[AmazonPayBackend] = (
      configLoader
        .loadConfig[Environment, AmazonPayConfig](env)
        .map(AmazonPayService.fromAmazonPayConfig): InitializationResult[AmazonPayService],
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
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService],
      ).mapN(AmazonPayBackend.apply)
  }
}
