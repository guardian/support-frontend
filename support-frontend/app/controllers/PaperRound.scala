package controllers

import actions.CustomActionBuilders
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.{getDeliveryAgentsFailure, getDeliveryAgentsSuccess}
import com.gu.monitoring.SafeLogging
import com.gu.support.config.Stage
import com.gu.support.config.Stages.CODE
import com.gu.support.paperround.CoverageEndpoint._
import com.gu.support.paperround.{AgentId, CoverageEndpoint, PaperRound, PaperRoundServiceProvider}
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import services.TestUserService

import scala.concurrent.ExecutionContext.Implicits.global

class PaperRound(
    components: ControllerComponents,
    serviceProvider: PaperRoundServiceProvider,
    actionRefiners: CustomActionBuilders,
    testUserService: TestUserService,
    stage: Stage,
) extends AbstractController(components)
    with Circe
    with SafeLogging {
  import actionRefiners._

  def getAgents(postcode: String): Action[AnyContent] = NoCacheAction().async { implicit request =>
    serviceProvider
      .forUser(false)
      .coverage(CoverageEndpoint.RequestBody(postcode = postcode))
      .map { result =>
        {
          val response = result.data.status match {
            case CO => Ok(toJson(Covered(result.data.agents.map(fromAgentsCoverage(_)))))
            case NC => Ok(toJson(NotCovered))
            case MP => NotFound(toJson(UnknownPostcode))
            case IP => BadRequest(toJson(ProblemWithInput))
            case IE =>
              val errorMessage = s"${result.data.message}"
              logger.error(scrub"Got internal error from PaperRound: $errorMessage")
              InternalServerError(toJson(PaperRoundError(errorMessage)))
          }
          result.data.status match {
            case IE => AwsCloudWatchMetricPut(cloudwatchClient)(getDeliveryAgentsFailure(stage))
            case _ => AwsCloudWatchMetricPut(cloudwatchClient)(getDeliveryAgentsSuccess(stage))
          }
          response
        }
      } recover {
      case PaperRound.Error(statusCode, message, errorCode) =>
        val responseBody = s"$errorCode – Got $statusCode reponse with message $message"
        logger.error(scrub"Error calling PaperRound, returning $responseBody")
        AwsCloudWatchMetricPut(cloudwatchClient)(getDeliveryAgentsFailure(stage))
        InternalServerError(responseBody)
      case error =>
        logger.error(scrub"Failed to get agents from PaperRound due to: $error")
        AwsCloudWatchMetricPut(cloudwatchClient)(getDeliveryAgentsFailure(stage))
        InternalServerError(s"Unknown error: $error")
    }
  }

  def fromAgentsCoverage(ac: AgentsCoverage): Agent = {
    Agent(
      agentId = ac.agentId,
      agentName = ac.agentName,
      deliveryMethod = ac.deliveryMethod,
      nbrDeliveryDays = ac.nbrDeliveryDays,
      postcode = ac.postcode,
      refGroupId = ac.refGroupId,
      summary = ac.summary,
    )
  }

  def toJson(x: GetAgentsResponse): Json = x.asJson
}

sealed trait GetAgentsResponse

object GetAgentsResponse {
  implicit val responseEncoder: Encoder[GetAgentsResponse] = new Encoder[GetAgentsResponse] {
    final def apply(r: GetAgentsResponse): Json = r match {
      case Covered(agents) => Json.obj("type" -> Json.fromString("Covered"), "agents" -> agents.asJson)
      case NotCovered => Json.obj("type" -> Json.fromString("NotCovered"))
      case UnknownPostcode => Json.obj("type" -> Json.fromString("UnknownPostcode"))
      case ProblemWithInput => Json.obj("type" -> Json.fromString("ProblemWithInput"))
      case PaperRoundError(message) =>
        Json.obj("type" -> Json.fromString("PaperRoundError"), "message" -> Json.fromString(message))
    }
  }
}

case class Covered(agents: List[Agent]) extends GetAgentsResponse
case class Agent(
    agentId: AgentId,
    agentName: String,
    deliveryMethod: String,
    nbrDeliveryDays: Integer,
    postcode: String,
    refGroupId: AgentId,
    summary: String,
)

object Agent {
  implicit val encoder: Encoder[Agent] = deriveEncoder
}

/** There are no delivery agents for this postcode. */
case object NotCovered extends GetAgentsResponse

/** This looks like a postcode but is not recognised. */
case object UnknownPostcode extends GetAgentsResponse

/** Input not a postcode (or not understood). */
case object ProblemWithInput extends GetAgentsResponse

/** Unknown error. */
case class PaperRoundError(message: String) extends GetAgentsResponse
