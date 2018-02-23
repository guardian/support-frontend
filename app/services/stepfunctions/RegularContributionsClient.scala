package services.stepfunctions

import java.util.UUID
import scala.concurrent.Future
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.gu.support.config.Stage
import RegularContributionsClient._
import com.gu.support.workers.model._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import codecs.CirceDecoders._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, CreatePaymentMethodState}
import play.api.mvc.Call
import com.gu.support.workers.model.monthlyContributions.Status
import monitoring.SafeLogger
import monitoring.SafeLogger._
import ophan.thrift.event.AbTest

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
    supportAbTests: Set[AbTest]
)

object RegularContributionsClient {
  sealed trait RegularContributionError
  case object StateMachineFailure extends RegularContributionError

  def apply(arn: String, stateWrapper: StateWrapper, supportUrl: String, call: String => Call)(implicit system: ActorSystem): RegularContributionsClient =
    new RegularContributionsClient(arn, stateWrapper, supportUrl, call)
}

case class StatusResponse(status: Status, trackingUri: String, message: Option[String] = None)
object StatusResponse {
  implicit val encoder: Encoder[StatusResponse] = deriveEncoder
}

class RegularContributionsClient(
    arn: String,
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
      contribution = request.contribution,
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

    def respondToClient(statusResponse: StatusResponse) = {
      SafeLogger.info(s"[$requestId] Client is polling for status - the current status for execution $jobId is: ${statusResponse.status}")
      statusResponse
    }

    underlying.history(jobId).bimap(
      { error =>
        SafeLogger.error(scrub"[$requestId] failed to get status of step function execution $jobId: $error")
        StateMachineFailure: RegularContributionError
      },
      { events =>
        val executionStatus = underlying.statusFromEvents(events)

        val trackingUri = supportUrl + statusCall(jobId).url

        val pendingOrFailure = if (executionStatus.exists(_.unsuccessful)) {
          respondToClient(StatusResponse(Status.Failure, trackingUri, None))
        } else {
          respondToClient(StatusResponse(Status.Pending, trackingUri, None))
        }

        events
          .collect { case event if event.getType == "LambdaFunctionSucceeded" => event.getLambdaFunctionSucceededEventDetails }
          .flatMap { event => stateWrapper.unWrap[CompletedState](event.getOutput).toOption }
          .headOption
          .map { event => respondToClient(StatusResponse(event.status, trackingUri, event.message)) }
          .getOrElse(pendingOrFailure)
      }
    )
  }
}
