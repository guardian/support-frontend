package services.stepfunctions

import java.util.UUID

import actions.CustomActionBuilders.OptionalAuthRequest
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import codecs.CirceDecoders._
import com.amazonaws.services.stepfunctions.model.StateExitedEventDetails
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.{Status, _}
import com.gu.support.workers.states.{CheckoutFailureState, CreatePaymentMethodState}
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import monitoring.SafeLogger
import monitoring.SafeLogger._
import ophan.thrift.event.AbTest
import play.api.mvc.Call
import services.stepfunctions.SupportWorkersClient._

import scala.concurrent.Future
import scala.util.{Failure, Success, Try}

object CreateSupportWorkersRequest {
  implicit val decoder: Decoder[CreateSupportWorkersRequest] = deriveDecoder
}
case class CreateSupportWorkersRequest(
    firstName: String,
    lastName: String,
    country: Country,
    state: Option[String],
    product: ProductType,
    paymentFields: PaymentFields,
    ophanIds: OphanIds,
    referrerAcquisitionData: ReferrerAcquisitionData,
    supportAbTests: Set[AbTest],
    email: String
)

object SupportWorkersClient {
  sealed trait SupportWorkersError
  case object StateMachineFailure extends SupportWorkersError

  def apply(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    call: String => Call
  )(implicit system: ActorSystem): SupportWorkersClient =
    new SupportWorkersClient(arn, stateWrapper, supportUrl, call)
}

case class StatusResponse(
    status: Status,
    trackingUri: String,
    failureReason: Option[CheckoutFailureReason] = None,
    guestAccountCreationToken: Option[String] = None
)

object StatusResponse {
  def fromStatusResponseAndToken(statusResponse: StatusResponse, token: Option[String]): StatusResponse =
    StatusResponse(statusResponse.status, statusResponse.trackingUri, statusResponse.failureReason, token)

  implicit val statusEncoder: Encoder[StatusResponse] = deriveEncoder
}

class SupportWorkersClient(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    statusCall: String => Call
)(implicit system: ActorSystem) {
  private implicit val sw = stateWrapper
  private implicit val ec = system.dispatcher
  private val underlying = Client(arn)

  private def referrerAcquisitionDataWithGAFields(request: OptionalAuthRequest[CreateSupportWorkersRequest]): ReferrerAcquisitionData = {
    val hostname = request.host
    val gaClientId = request.cookies.get("_ga").map(_.value)
    val userAgent = request.headers.get("user-agent")
    val ipAddress = request.remoteAddress
    request.body.referrerAcquisitionData.copy(hostname = Some(hostname), gaClientId = gaClientId, userAgent = userAgent, ipAddress = Some(ipAddress))
  }

  def createSubscription(
    request: OptionalAuthRequest[CreateSupportWorkersRequest],
    user: User,
    requestId: UUID
  ): EitherT[Future, SupportWorkersError, StatusResponse] = {
    import io.circe.generic.auto._
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      product = request.body.product,
      paymentFields = request.body.paymentFields,
      acquisitionData = Some(AcquisitionData(
        ophanIds = request.body.ophanIds,
        referrerAcquisitionData = referrerAcquisitionDataWithGAFields(request),
        supportAbTests = request.body.supportAbTests
      )),
      promoCode = None
    )
    underlying.triggerExecution(createPaymentMethodState, user.isTestUser).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] Failed to create regular contribution for ${user.id} - $error")
        StateMachineFailure: SupportWorkersError
      },
      { success =>
        SafeLogger.info(s"[$requestId] Creating regular contribution for ${user.id} ($success)")
        underlying.jobIdFromArn(success.arn).map { jobId =>
          StatusResponse(
            status = Status.Pending,
            trackingUri = supportUrl + statusCall(jobId).url
          )
        } getOrElse {
          SafeLogger.error(scrub"[$requestId] Failed to parse ${success.arn} to a jobId when creating new regular contribution for ${user.id} $request")
          StatusResponse(
            status = Status.Failure,
            trackingUri = "",
            failureReason = Some(CheckoutFailureReasons.Unknown)
          )
        }

      }
    )
  }

  def status(jobId: String, requestId: UUID): EitherT[Future, SupportWorkersError, StatusResponse] = {

    def respondToClient(statusResponse: StatusResponse): StatusResponse = {
      SafeLogger.info(s"[$requestId] Client is polling for status - the current status for execution $jobId is: ${statusResponse}")
      statusResponse
    }

    underlying.history(jobId).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] failed to get status of step function execution $jobId: $error")
        StateMachineFailure: SupportWorkersError
      },
      { events =>
        val trackingUri = supportUrl + statusCall(jobId).url
        val detailedHistory = events.map(event => Try(event.getStateExitedEventDetails))
        respondToClient(StepFunctionExecutionStatus.checkoutStatus(detailedHistory, stateWrapper, trackingUri))
      }
    )

  }

  def healthy(): Future[Boolean] =
    underlying.status.map(_.getStatus == "ACTIVE").getOrElse(false)

}

object StepFunctionExecutionStatus {

  def checkoutStatus(detailedHistory: List[Try[StateExitedEventDetails]], stateWrapper: StateWrapper, trackingUri: String): StatusResponse = {

    val searchForFinishedCheckout: Option[StatusResponse] = detailedHistory.collectFirst {
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("CheckoutSuccess") =>
        StatusResponse(Status.Success, trackingUri, None)
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("SucceedOrFailChoice") =>
        StatusResponse(Status.Failure, trackingUri, getFailureDetails(stateWrapper, detailsAttempt.get))
    }

    searchForFinishedCheckout.getOrElse(StatusResponse(Status.Pending, trackingUri, None))

  }

  def getFailureDetails(stateWrapper: StateWrapper, eventDetails: StateExitedEventDetails): Option[CheckoutFailureReason] = {
    import io.circe.generic.auto._
    SafeLogger.info(s"Event details are: $eventDetails")
    stateWrapper.unWrap[CheckoutFailureState](eventDetails.getOutput) match {
      case Success(checkoutFailureState) =>
        Some(checkoutFailureState.checkoutFailureReason)
      case Failure(error) =>
        SafeLogger.error(scrub"Failed to determine checkout failure reason due to $error")
        None
    }

  }

}
