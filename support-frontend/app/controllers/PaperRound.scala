package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.rest.{CodeBody, WebServiceHelperError}
import com.gu.support.paperround.PaperRoundService
import com.gu.support.paperround.PaperRoundService.CoverageEndpoint
import com.gu.support.paperround.PaperRoundService.CoverageEndpoint._
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class PaperRound(
    components: ControllerComponents,
    service: PaperRoundService,
    actionRefiners: CustomActionBuilders,
) extends AbstractController(components)
    with Circe {
  import actionRefiners._

  def getAgents(postcode: String): Action[AnyContent] = NoCacheAction().async { implicit request =>
    service.coverage(CoverageEndpoint.RequestBody(postcode = postcode)).map { result =>
      result.data.status match {
        case CO => Ok(toJson(Agents(result.data.agents.map(fromAgentsCoverage(_)))))
        case NC => Ok(toJson(NotCovered))
        case MP => NotFound(toJson(UnknownOrInvalidPostcode))
        case IP => BadRequest(toJson(ProblemWithInput))
        case IE =>
          val errorMessage = s"${result.message}: ${result.data.message}"
          SafeLogger.error(scrub"Got internal error from PaperRound: $errorMessage")
          InternalServerError(toJson(PaperRoundError(errorMessage)))
      }
    } recover {
      case PaperRoundService.Error(statusCode, message, errorCode) =>
        val responseBody = s"$errorCode – Got $statusCode reponse with message $message"
        SafeLogger.error(scrub"Error calling PaperRound, returning $responseBody")
        InternalServerError(responseBody)
      case error =>
        SafeLogger.error(scrub"Failed to get agents from PaperRound due to: $error")
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
      case Agents(agents) => Json.obj("type" -> Json.fromString("Success"), "agents" -> agents.asJson)
      case NotCovered => Json.obj("type" -> Json.fromString("NotCovered"))
      case UnknownOrInvalidPostcode => Json.obj("type" -> Json.fromString("UnknownOrInvalidPostcode"))
      case ProblemWithInput => Json.obj("type" -> Json.fromString("ProblemWithInput"))
      case PaperRoundError(message) =>
        Json.obj("type" -> Json.fromString("PaperRoundError"), "message" -> Json.fromString(message))
    }
  }
}

case class Agents(agents: List[Agent]) extends GetAgentsResponse
case class Agent(
    agentId: Integer,
    agentName: String,
    deliveryMethod: String,
    nbrDeliveryDays: Integer,
    postcode: String,
    refGroupId: Integer,
    summary: String,
)

object Agent {
  implicit val encoder: Encoder[Agent] = deriveEncoder
}

/** There are no delivery agents for this postcode. */
case object NotCovered extends GetAgentsResponse

case object UnknownOrInvalidPostcode extends GetAgentsResponse

case object ProblemWithInput extends GetAgentsResponse

case class PaperRoundError(message: String) extends GetAgentsResponse
