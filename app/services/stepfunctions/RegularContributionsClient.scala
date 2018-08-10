package services.stepfunctions

import java.util.UUID

import scala.concurrent.Future
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import RegularContributionsClient._
import com.gu.support.workers.model._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import codecs.CirceDecoders._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.support.workers.model.states.CreatePaymentMethodState
import play.api.mvc.Call
import com.gu.support.workers.model.Status
import monitoring.SafeLogger
import monitoring.SafeLogger._
import ophan.thrift.event.AbTest

import scala.util.{Success, Try}

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
    email: String
)

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

case class StatusResponse(status: Status, trackingUri: String, message: Option[String] = None)
object StatusResponse {
  implicit val encoder: Encoder[StatusResponse] = deriveEncoder
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

  def createContributor(request: CreateRegularContributorRequest, user: User, requestId: UUID): EitherT[Future, RegularContributionError, StatusResponse] = {
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      product = request.contribution,
      paymentFields = request.paymentFields,
      acquisitionData = Some(AcquisitionData(
        ophanIds = request.ophanIds,
        referrerAcquisitionData = request.referrerAcquisitionData,
        supportAbTests = request.supportAbTests
      ))
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
            message = Some("Failed to process request - please contact customer support")
          )
        }

      }
    )
  }

  def status(jobId: String, requestId: UUID): EitherT[Future, RegularContributionError, StatusResponse] = {

    def respondToClient(statusResponse: StatusResponse): StatusResponse = {
      SafeLogger.info(s"[$requestId] Client is polling for status - the current status for execution $jobId is: ${statusResponse.status}")
      statusResponse
    }

    def checkoutStatus(detailedHistory: List[Try[String]], trackingUri: String): StatusResponse = {
      detailedHistory match {
        case history if history.contains(Success("CheckoutSuccess")) => StatusResponse(Status.Success, trackingUri, None)
        case history if history.contains(Success("CheckoutFailure")) => StatusResponse(Status.Failure, trackingUri, None)
        case _ => StatusResponse(Status.Pending, trackingUri, None)
      }
    }

    underlying.history(jobId).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] failed to get status of step function execution $jobId: $error")
        StateMachineFailure: RegularContributionError
      },
      { events =>
        val trackingUri = supportUrl + statusCall(jobId).url
        val detailedHistory = events.map(event => Try(event.getStateExitedEventDetails.getName))
        respondToClient(checkoutStatus(detailedHistory, trackingUri))
      }
    )

  }

  def healthy(): Future[Boolean] =
    underlying.status.map(_.getStatus == "ACTIVE").getOrElse(false)

}
