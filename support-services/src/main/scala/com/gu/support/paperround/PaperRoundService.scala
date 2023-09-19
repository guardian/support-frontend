package com.gu.support.paperround

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.PaperRoundConfig
import java.time.ZonedDateTime
import io.circe._
import io.circe.generic.semiauto._
import io.circe.generic.extras.semiauto._
import io.circe.generic.extras.decoding.ConfiguredDecoder
import io.circe.generic.extras.Configuration

import scala.concurrent.{ExecutionContext, Future}

import PaperRoundService.{AgentsEndpoint, CoverageEndpoint, ChargeBandsEndpoint}

class PaperRoundService(config: PaperRoundConfig, client: FutureHttpClient)(implicit
    executionContext: ExecutionContext,
) extends WebServiceHelper[PaperRoundService.Error] {
  override val wsUrl: String = config.apiUrl
  override val httpClient: FutureHttpClient = client

  private def coveredResponse(agents: List[CoverageEndpoint.AgentsCoverage]) = {
    Future.successful(
      CoverageEndpoint.Response(
        statusCode = 200,
        message = "",
        data = CoverageEndpoint.PostcodeCoverage(
          agents = agents,
          message = "",
          status = CoverageEndpoint.CO,
        ),
      ),
    )
  }

  private def testAgents(postcode: String) = List(
    CoverageEndpoint.AgentsCoverage(
      agentId = 1,
      agentName = "Test agent",
      deliveryMethod = "Car",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 1,
      summary = "A test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 2,
      agentName = "Another test agent",
      deliveryMethod = "Balloon",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 4,
      summary = "An odd test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 3,
      agentName = "Another other test agent",
      deliveryMethod = "Zeppelin",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 3,
      summary = "An odder test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 4,
      agentName = "Agent 4",
      deliveryMethod = "Car",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 4,
      summary = "The fourth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 5,
      agentName = "Agent 5",
      deliveryMethod = "Motorcycle",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 5,
      summary = "The fifth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 6,
      agentName = "Agent 6",
      deliveryMethod = "Bicycle",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 6,
      summary = "The sixth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 7,
      agentName = "Agent 7",
      deliveryMethod = "By foot",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 7,
      summary = "The seventh delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 8,
      agentName = "Agent 8",
      deliveryMethod = "Truck",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 20,
      summary = "The eighth test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 11,
      agentName = "Test agent",
      deliveryMethod = "Car",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 11,
      summary = "A test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 12,
      agentName = "Another test agent",
      deliveryMethod = "Balloon",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 12,
      summary = "An odd test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 13,
      agentName = "Another other test agent",
      deliveryMethod = "Zeppelin",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 13,
      summary = "An odder test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 14,
      agentName = "Agent 14",
      deliveryMethod = "Car",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 14,
      summary = "The fourth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 15,
      agentName = "Agent 15",
      deliveryMethod = "Motorcycle",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 15,
      summary = "The fifth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 16,
      agentName = "Agent 16",
      deliveryMethod = "Bicycle",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 16,
      summary = "The sixth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 17,
      agentName = "Agent 17",
      deliveryMethod = "By foot",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 17,
      summary = "The seventh delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 18,
      agentName = "Agent 18",
      deliveryMethod = "Truck",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 120,
      summary = "The eighth test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 21,
      agentName = "Test agent",
      deliveryMethod = "Car",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 21,
      summary = "A test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 22,
      agentName = "Another test agent",
      deliveryMethod = "Balloon",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 22,
      summary = "An odd test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 23,
      agentName = "Another other test agent",
      deliveryMethod = "Zeppelin",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 23,
      summary = "An odder test delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 24,
      agentName = "Agent 24",
      deliveryMethod = "Car",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 24,
      summary = "The fourth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 25,
      agentName = "Agent 25",
      deliveryMethod = "Motorcycle",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 25,
      summary = "The fifth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 26,
      agentName = "Agent 26",
      deliveryMethod = "Bicycle",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 26,
      summary = "The sixth test agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 27,
      agentName = "Agent 27",
      deliveryMethod = "By foot",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 27,
      summary = "The seventh delivery agent",
    ),
    CoverageEndpoint.AgentsCoverage(
      agentId = 28,
      agentName = "Agent 28",
      deliveryMethod = "Truck",
      nbrDeliveryDays = 7,
      postcode = postcode,
      refGroupId = 220,
      summary = "The eighth test delivery agent",
    ),
  )

  def coverage(body: CoverageEndpoint.RequestBody): Future[CoverageEndpoint.Response] = {
    if (body.postcode == "DE1 0FD" || body.postcode == "DE10FD") {
      coveredResponse(testAgents(body.postcode))
    } else if (body.postcode == "DE1 0HN" || body.postcode == "DE10HN") {
      coveredResponse(testAgents(body.postcode).take(1))
    } else {
      postForm[CoverageEndpoint.Response](
        endpoint = "coverage",
        data = Map("postcode" -> List(body.postcode)),
        headers = Map("x-api-key" -> config.apiKey),
      )
    }
  }

  def agents(): Future[AgentsEndpoint.Response] = {
    postForm[AgentsEndpoint.Response](
      endpoint = "agents",
      data = Map.empty,
      headers = Map("x-api-key" -> config.apiKey),
    )
  }

  def chargebands(): Future[ChargeBandsEndpoint.Response] = {
    postForm[ChargeBandsEndpoint.Response](
      endpoint = "chargebands",
      data = Map.empty,
      headers = Map("x-api-key" -> config.apiKey),
    )
  }
}

object PaperRoundService {
  val snakeCase: Configuration = Configuration.default.withSnakeCaseMemberNames
  val lowercase: Configuration = Configuration.default.copy(transformMemberNames = _.toLowerCase)
  case class Error(statusCode: Integer, message: String, errorCode: ZonedDateTime)
      extends Throwable(s"Error(statusCode = $statusCode, message = $message, errorCode = $errorCode)")
  object Error {
    implicit val config = snakeCase
    implicit val errorDecoder: Decoder[Error] = deriveConfiguredDecoder
  }

  object AgentsEndpoint {
    case class Response(statusCode: Integer, message: String, data: AgentsList)

    case class AgentsList(agents: List[AgentDetails])
    case class AgentDetails(
        agentName: String,
        refId: Integer,
        refGroupId: Integer,
        startDate: String,
        endDate: String,
        address1: String,
        address2: String,
        town: String,
        county: String,
        postcode: String,
        telephone: String,
        email: String,
    )
    object AgentDetails {
      implicit val config = lowercase
      implicit val agentDetailsDecoder: Decoder[AgentDetails] = deriveConfiguredDecoder
    }

    implicit val config = snakeCase
    implicit val responseDecoder: Decoder[Response] = deriveConfiguredDecoder
    implicit val agentsListDecoder: Decoder[AgentsList] = deriveConfiguredDecoder
  }

  object ChargeBandsEndpoint {
    case class Response(statusCode: Integer, data: DeliveryChargeProfiles)

    case class DeliveryChargeProfiles(bands: List[DeliveryChargeProfile])
    case class DeliveryChargeProfile(
        deliveryChargeId: Integer,
        description: String,
        monday: Double,
        tuesday: Double,
        wednesday: Double,
        thursday: Double,
        friday: Double,
        saturday: Double,
        sunday: Double,
    )

    implicit val config = snakeCase
    implicit val responseDecoder: Decoder[Response] = deriveConfiguredDecoder
    implicit val deliveryChargeProfilesDecoder: Decoder[DeliveryChargeProfiles] = deriveConfiguredDecoder
    implicit val deliveryChargeProfileDecoder: Decoder[DeliveryChargeProfile] = Decoder.forProduct9(
      "deliverychargeid",
      "description",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    )(
      (
          dci: Integer,
          d: String,
          mon: Double,
          tue: Double,
          wed: Double,
          thu: Double,
          fri: Double,
          sat: Double,
          sun: Double,
      ) =>
        DeliveryChargeProfile(
          deliveryChargeId = dci,
          description = d,
          monday = mon,
          tuesday = tue,
          wednesday = wed,
          thursday = thu,
          friday = fri,
          saturday = sat,
          sunday = sun,
        ),
    )
  }

  object CoverageEndpoint {
    case class RequestBody(postcode: String)

    case class Response(statusCode: Integer, message: String, data: PostcodeCoverage)

    case class PostcodeCoverage(agents: List[AgentsCoverage], message: String, status: CoverageStatus)
    case class AgentsCoverage(
        agentId: Integer,
        agentName: String,
        deliveryMethod: String,
        nbrDeliveryDays: Integer,
        postcode: String,
        refGroupId: Integer,
        summary: String,
    )
    object AgentsCoverage {
      implicit val config = lowercase
      implicit val decoder: Decoder[AgentsCoverage] = deriveConfiguredDecoder
    }

    sealed trait CoverageStatus

    /** Postcode is covered, see agent list. */
    case object CO extends CoverageStatus

    /** Postcode has no agent coverage. */
    case object NC extends CoverageStatus

    /** Postcode is missing from the list of valid postcodes. */
    case object MP extends CoverageStatus

    /** Problem with input. */
    case object IP extends CoverageStatus

    /** Internal PaperRound system error. */
    case object IE extends CoverageStatus

    implicit val config = snakeCase
    implicit val responseDecoder: Decoder[Response] = deriveConfiguredDecoder
    implicit val postcodeCoverageDecoder: Decoder[PostcodeCoverage] = deriveConfiguredDecoder
    implicit val coverageStatusDecoder: Decoder[CoverageStatus] = deriveEnumerationDecoder
  }

  object ServerStatusEndpoint {
    case class Response(statusCode: Integer, data: Server)

    case class Server(status: String)

    implicit val config = snakeCase
    implicit val responseDecoder: Decoder[Response] = deriveConfiguredDecoder
    implicit val serverDecoder: Decoder[Server] = deriveConfiguredDecoder
  }
}
