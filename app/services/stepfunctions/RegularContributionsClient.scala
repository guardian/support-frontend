package services.stepfunctions

import java.util.UUID

import scala.concurrent.Future
import akka.actor.ActorSystem
import cats.data.EitherT
import cats.implicits._
import com.gu.support.config.Stage
import RegularContributionsClient._
import com.gu.support.workers.model.{AcquisitionData, PayPalPaymentFields, StripePaymentFields, User}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import codecs.CirceDecoders._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.typesafe.scalalogging.LazyLogging
import com.gu.i18n.Country
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, CreatePaymentMethodState}
import play.api.mvc.Call
import com.gu.support.workers.model.monthlyContributions.Status
import ophan.thrift.event.AbTest

object StripePaymentToken {
  implicit val decoder: Decoder[StripePaymentToken] = deriveDecoder
}
case class StripePaymentToken(stripeToken: String) {
  def stripePaymentFields(userId: String): StripePaymentFields = StripePaymentFields(
    userId = userId,
    stripeToken = stripeToken
  )
}

object CreateRegularContributorRequest {
  implicit val decoder: Decoder[CreateRegularContributorRequest] = deriveDecoder
}
case class CreateRegularContributorRequest(
    firstName: String,
    lastName: String,
    country: Country,
    state: Option[String],
    contribution: Contribution,
    paymentFields: Either[StripePaymentToken, PayPalPaymentFields],
    ophanIds: OphanIds,
    referrerAcquisitionData: ReferrerAcquisitionData,
    supportAbTests: Set[AbTest]
)

object RegularContributionsClient {
  sealed trait RegularContributionError
  case object StateMachineFailure extends RegularContributionError

  def apply(stage: Stage, stateWrapper: StateWrapper, supportUrl: String, call: String => Call)(implicit system: ActorSystem): RegularContributionsClient =
    new RegularContributionsClient(stage, stateWrapper, supportUrl, call)
}

case class StatusResponse(status: Status, trackingUri: String, message: Option[String] = None)
object StatusResponse {
  implicit val encoder: Encoder[StatusResponse] = deriveEncoder
}

class RegularContributionsClient(
    stage: Stage,
    stateWrapper: StateWrapper,
    supportUrl: String,
    statusCall: String => Call
)(implicit system: ActorSystem) extends LazyLogging {
  private implicit val sw = stateWrapper
  private implicit val ec = system.dispatcher
  private val underlying = Client(s"MonthlyContributions${stage.toString}-")

  def createContributor(request: CreateRegularContributorRequest, user: User, requestId: UUID): EitherT[Future, RegularContributionError, StatusResponse] = {
    val createPaymentMethodState = CreatePaymentMethodState(
      requestId = requestId,
      user = user,
      contribution = request.contribution,
      paymentFields = request.paymentFields.leftMap(_.stripePaymentFields(user.id)),
      acquisitionData = Some(AcquisitionData(
        ophanIds = request.ophanIds,
        referrerAcquisitionData = request.referrerAcquisitionData,
        supportAbTests = request.supportAbTests
      ))
    )
    underlying.triggerExecution(createPaymentMethodState).bimap(
      { error =>
        logger.error(s"[$requestId] Failed to create regular contribution - $error")
        StateMachineFailure: RegularContributionError
      },
      { success =>
        logger.info(s"[$requestId] Creating regular contribution ($success)")
        underlying.jobIdFromArn(success.arn).map { jobId =>
          StatusResponse(
            status = Status.Pending,
            trackingUri = supportUrl + statusCall(jobId).url
          )
        } getOrElse {
          logger.error(s"Failed to parse ${success.arn} to a jobId when creating new regular contribution $request")
          StatusResponse(
            status = Status.Failure,
            trackingUri = "",
            message = Some("Failed to process request - please contact custom support")
          )
        }

      }
    )
  }

  def status(jobId: String, requestId: UUID): EitherT[Future, RegularContributionError, StatusResponse] = {
    underlying.history(jobId).bimap(
      { error =>
        logger.error(s"[$requestId] Failed to get execution status of $jobId - $error")
        StateMachineFailure: RegularContributionError
      },
      { events =>
        val executionStatus = underlying.statusFromEvents(events)

        val trackingUri = supportUrl + statusCall(jobId).url

        val pendingOrFailure = if (executionStatus.exists(_.unsuccessful)) {
          StatusResponse(Status.Failure, trackingUri, None)
        } else {
          StatusResponse(Status.Pending, trackingUri, None)
        }

        events
          .collect { case event if event.getType == "LambdaFunctionSucceeded" => event.getLambdaFunctionSucceededEventDetails }
          .flatMap { event => stateWrapper.unWrap[CompletedState](event.getOutput).toOption }
          .headOption
          .map { event => StatusResponse(event.status, trackingUri, event.message) }
          .getOrElse(pendingOrFailure)
      }
    )
  }
}
