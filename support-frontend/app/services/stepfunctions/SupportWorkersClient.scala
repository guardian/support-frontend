package services.stepfunctions

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.stepfunctions.model.StateExitedEventDetails
import com.gu.i18n.{CountryGroup, Title}
import com.gu.monitoring.SafeLogging
import com.gu.support.acquisitions.{AbTest, AcquisitionData, OphanIds, ReferrerAcquisitionData}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers._
import com.gu.support.workers.states.{AnalyticsInfo, CheckoutFailureState, CreatePaymentMethodState}
import org.apache.pekko.actor.ActorSystem
import io.circe.{Decoder, Encoder}
import org.joda.time.LocalDate
import play.api.mvc.{Call, Request}
import services.stepfunctions.CreateSupportWorkersRequest.GiftRecipientRequest
import services.stepfunctions.SupportWorkersClient._

import java.util.UUID
import scala.concurrent.{ExecutionContextExecutor, Future}
import scala.util.{Failure, Success, Try}

object CreateSupportWorkersRequest {

  import com.gu.support.encoding.CustomCodecs._

  implicit val giftRecipientCodec: Codec[GiftRecipientRequest] = deriveCodec
  implicit val createSupportWorkersRequestCodec: Codec[CreateSupportWorkersRequest] = deriveCodec
  case class GiftRecipientRequest(
      title: Option[Title],
      firstName: String,
      lastName: String,
      email: Option[String],
      message: Option[String],
      deliveryDate: Option[LocalDate],
  )
}

case class CreateSupportWorkersRequest(
    title: Option[Title],
    firstName: String,
    lastName: String,
    billingAddress: Address,
    deliveryAddress: Option[Address],
    giftRecipient: Option[GiftRecipientRequest],
    product: ProductType,
    productInformation: Option[ProductInformation],
    firstDeliveryDate: Option[LocalDate],
    paymentFields: PaymentFields,
    appliedPromotion: Option[AppliedPromotion],
    csrUsername: Option[String],
    salesforceCaseId: Option[String],
    ophanIds: OphanIds,
    referrerAcquisitionData: ReferrerAcquisitionData,
    supportAbTests: Set[AbTest],
    email: String,
    telephoneNumber: Option[String],
    deliveryInstructions: Option[String],
    debugInfo: Option[String],
    similarProductsConsent: Option[Boolean],
)

object SupportWorkersClient {

  sealed trait SupportWorkersError

  case object StateMachineFailure extends SupportWorkersError

  def apply(
      arn: StateMachineArn,
      stateWrapper: StateWrapper,
      supportUrl: String,
      call: String => Call,
  )(implicit system: ActorSystem): SupportWorkersClient =
    new SupportWorkersClient(arn, stateWrapper, supportUrl, call)
}

case class StatusResponse(
    status: Status,
    trackingUri: String,
    failureReason: Option[CheckoutFailureReason] = None,
)

object StatusResponse {
  implicit val codec: Codec[StatusResponse] = deriveCodec
}

class SupportWorkersClient(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    statusCall: String => Call,
)(implicit system: ActorSystem)
    extends SafeLogging {
  private implicit val sw: StateWrapper = stateWrapper
  private implicit val ec: ExecutionContextExecutor = system.dispatcher
  private val underlying = Client(arn)

  private def referrerAcquisitionDataWithGAFields(
      request: Request[CreateSupportWorkersRequest],
  ): ReferrerAcquisitionData = {
    val hostname = request.host
    val gaClientId = request.cookies.get("_ga").map(_.value)
    val userAgent = request.headers.get("user-agent")
    val ipAddress = request.remoteAddress
    request.body.referrerAcquisitionData.copy(
      hostname = Some(hostname),
      gaClientId = gaClientId,
      userAgent = userAgent,
      ipAddress = Some(ipAddress),
    )
  }

  private def getGiftRecipient(giftRecipient: GiftRecipientRequest, product: ProductType) =
    product match {
      case _: GuardianWeekly =>
        Right(
          GiftRecipient(
            giftRecipient.title,
            giftRecipient.firstName,
            giftRecipient.lastName,
            giftRecipient.email,
          ),
        )
      case _ =>
        Left(s"gifting is not supported for $product")
    }

  def createSubscription(
      request: Request[CreateSupportWorkersRequest],
      user: User,
      requestId: UUID,
  ): EitherT[Future, String, StatusResponse] = {
    for {
      giftRecipient <- EitherT.fromEither[Future](
        request.body.giftRecipient.map(getGiftRecipient(_, request.body.product)).sequence,
      )
      createPaymentMethodState = CreatePaymentMethodState(
        requestId = requestId,
        user = user,
        giftRecipient = giftRecipient,
        product = request.body.product,
        productInformation = request.body.productInformation,
        analyticsInfo = AnalyticsInfo(
          giftRecipient.isDefined,
          PaymentProvider.fromPaymentFields(request.body.paymentFields),
        ),
        paymentFields = request.body.paymentFields,
        acquisitionData = Some(
          AcquisitionData(
            ophanIds = request.body.ophanIds,
            referrerAcquisitionData = referrerAcquisitionDataWithGAFields(request),
            supportAbTests = request.body.supportAbTests,
          ),
        ),
        appliedPromotion = request.body.appliedPromotion,
        csrUsername = request.body.csrUsername,
        salesforceCaseId = request.body.salesforceCaseId,
        firstDeliveryDate = request.body.firstDeliveryDate,
        userAgent = request.headers.get("user-agent").getOrElse("Unknown"),
        ipAddress =
          request.headers.get("X-Forwarded-For").flatMap(_.split(',').headOption).getOrElse(request.remoteAddress),
        similarProductsConsent = request.body.similarProductsConsent,
      )
      name =
        (if (user.isTestUser) "TestUser-" else "") +
          createPaymentMethodState.product.describe + "-" +
          createPaymentMethodState.paymentFields.describe
      executionResult <- underlying
        .triggerExecution(createPaymentMethodState, user.isTestUser, name)
        .bimap(
          { error =>
            logger.error(scrub"[$requestId] Failed to trigger Step Function execution for ${user.id} - $error")
            StateMachineFailure.toString
          },
          { success =>
            logger.info(s"[$requestId] Successfully triggered Step Function execution for ${user.id} ($success)")
            underlying.jobIdFromArn(success.arn).map { jobId =>
              StatusResponse(
                status = Status.Pending,
                trackingUri = supportUrl + statusCall(jobId).url,
              )
            } getOrElse {
              logger.error(
                scrub"[$requestId] Failed to parse ${success.arn} to a jobId after triggering Step Function execution for ${user.id} $request",
              )
              StatusResponse(
                status = Status.Failure,
                trackingUri = "",
                failureReason = Some(CheckoutFailureReasons.Unknown),
              )
            }

          },
        )
    } yield executionResult

  }

  def status(jobId: String, requestId: UUID): EitherT[Future, SupportWorkersError, StatusResponse] = {

    def respondToClient(statusResponse: StatusResponse): StatusResponse = {
      logger.info(
        s"[$requestId] Client is polling for status - the current status for execution $jobId is: ${statusResponse}",
      )
      statusResponse
    }

    underlying
      .history(jobId)
      .bimap(
        { error =>
          logger.error(scrub"[$requestId] failed to get status of step function execution $jobId: $error")
          StateMachineFailure: SupportWorkersError
        },
        { events =>
          val trackingUri = supportUrl + statusCall(jobId).url
          val detailedHistory = events.map(event => Try(event.getStateExitedEventDetails))
          respondToClient(StepFunctionExecutionStatus.checkoutStatus(detailedHistory, stateWrapper, trackingUri))
        },
      )

  }

  def healthy(): Future[Boolean] =
    underlying.status().map(_.getStatus == "ACTIVE").getOrElse(false)

}

object StepFunctionExecutionStatus extends SafeLogging {

  def checkoutStatus(
      detailedHistory: List[Try[StateExitedEventDetails]],
      stateWrapper: StateWrapper,
      trackingUri: String,
  ): StatusResponse = {

    val searchForFinishedCheckout: Option[StatusResponse] = detailedHistory.collectFirst {
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("CheckoutSuccess") =>
        StatusResponse(Status.Success, trackingUri, None)
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("SucceedOrFailChoice") =>
        StatusResponse(Status.Failure, trackingUri, getFailureDetails(stateWrapper, detailsAttempt.get))
    }

    searchForFinishedCheckout.getOrElse(StatusResponse(Status.Pending, trackingUri, None))

  }

  def getFailureDetails(
      stateWrapper: StateWrapper,
      eventDetails: StateExitedEventDetails,
  ): Option[CheckoutFailureReason] = {
    logger.info(s"Event details are: $eventDetails")
    stateWrapper.unWrap[CheckoutFailureState](eventDetails.getOutput) match {
      case Success(checkoutFailureState) =>
        Some(checkoutFailureState.checkoutFailureReason)
      case Failure(error) =>
        logger.error(scrub"Failed to determine checkout failure reason due to $error")
        None
    }

  }

}
