package services.stepfunctions

import java.util.UUID

import scala.concurrent.Future
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import RegularContributionsClient._
import com.gu.support.workers.model._
import io.circe.generic.semiauto.deriveDecoder
import io.circe.Decoder
import codecs.CirceDecoders._
import com.amazonaws.services.stepfunctions.model.StateExitedEventDetails
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.support.workers.model.AccessScope.ScopeToken
import com.gu.support.workers.model.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.model.states.{CheckoutFailureState, CreatePaymentMethodState}
import play.api.mvc.Call
import com.gu.support.workers.model.Status
import monitoring.SafeLogger
import monitoring.SafeLogger._
import ophan.thrift.event.AbTest
import scala.util.{Failure, Success, Try}

object CreateRegularContributorRequest {
  implicit val decoder: Decoder[CreateRegularContributorRequest] = deriveDecoder
}
case class CreateRegularContributorRequest(
    firstName: String,
    lastName: String,
    country: Country,
    state: Option[String],
    contribution: Contribution,
    paymentFields: PaymentFields,
    ophanIds: OphanIds,
    referrerAcquisitionData: ReferrerAcquisitionData,
    supportAbTests: Set[AbTest],
    email: String,
    scopeToken: Option[String]
) {
  def maybeScopeToken: Option[ScopeToken] = scopeToken.filter(_.length > 0).map(ScopeToken.apply)
}

object RegularContributionsClient {
  sealed trait RegularContributionError
  case object StateMachineFailure extends RegularContributionError

  def apply(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    call: String => Call
  )(implicit system: ActorSystem): RegularContributionsClient =
    new RegularContributionsClient(arn, stateWrapper, supportUrl, call)
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
}

class RegularContributionsClient(
    arn: StateMachineArn,
    stateWrapper: StateWrapper,
    supportUrl: String,
    statusCall: String => Call
)(implicit system: ActorSystem) {
  private implicit val sw = stateWrapper
  private implicit val ec = system.dispatcher
  private val underlying = Client(arn)

  def createContributor(
    request: CreateRegularContributorRequest,
    user: User, requestId: UUID,
    accessScope: AccessScope
  ): EitherT[Future, RegularContributionError, StatusResponse] = {
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      product = request.contribution,
      paymentFields = request.paymentFields,
      acquisitionData = Some(AcquisitionData(
        ophanIds = request.ophanIds,
        referrerAcquisitionData = request.referrerAcquisitionData,
        supportAbTests = request.supportAbTests
      )),
      scopeToken = accessScope.toOption
    )
    underlying.triggerExecution(createPaymentMethodState, user.isTestUser).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] Failed to create regular contribution for ${user.id} - $error")
        StateMachineFailure: RegularContributionError
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

  def status(jobId: String, requestId: UUID): EitherT[Future, RegularContributionError, StatusResponse] = {

    def respondToClient(statusResponse: StatusResponse): StatusResponse = {
      SafeLogger.info(s"[$requestId] Client is polling for status - the current status for execution $jobId is: ${statusResponse}")
      statusResponse
    }

    underlying.history(jobId).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] failed to get status of step function execution $jobId: $error")
        StateMachineFailure: RegularContributionError
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
      case detailsAttempt if detailsAttempt.map(_.getName) == Success("CheckoutFailure") =>
        StatusResponse(Status.Failure, trackingUri, getFailureDetails(stateWrapper, detailsAttempt.get))
    }

    searchForFinishedCheckout.getOrElse(StatusResponse(Status.Pending, trackingUri, None))

  }

  def getFailureDetails(stateWrapper: StateWrapper, eventDetails: StateExitedEventDetails): Option[CheckoutFailureReason] = {
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
