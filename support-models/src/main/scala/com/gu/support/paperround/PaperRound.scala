package com.gu.support.paperround

import io.circe.generic.extras.Configuration
import io.circe._
import io.circe.generic.semiauto._
import io.circe.generic.extras.semiauto._
import io.circe.generic.extras.decoding.ConfiguredDecoder
import java.time.ZonedDateTime

import scala.concurrent.{ExecutionContext, Future}

trait PaperRoundAPI {
  def coverage(body: CoverageEndpoint.RequestBody): Future[CoverageEndpoint.Response]
  def agents(): Future[AgentsEndpoint.Response]
  def chargebands(): Future[ChargeBandsEndpoint.Response]
}

case class AgentId(val id: BigInt) extends AnyVal

object AgentId {
  implicit val encoder: Encoder[AgentId] = Encoder.encodeBigInt.contramap(_.id)
  implicit val decoder: Decoder[AgentId] = Decoder.decodeBigInt.map(AgentId(_))
}

object AgentsEndpoint {
  case class Response(statusCode: Integer, data: AgentsList)

  case class AgentsList(agents: List[AgentDetails])
  case class AgentDetails(
      agentName: String,
      refId: AgentId,
      refGroupId: AgentId,
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
    implicit val config = DecoderConfiguration.lowercase
    implicit val agentDetailsDecoder: Decoder[AgentDetails] = deriveConfiguredDecoder
  }

  implicit val config = DecoderConfiguration.snakeCase
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

  implicit val config = DecoderConfiguration.snakeCase
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

  case class Response(statusCode: Integer, data: PostcodeCoverage, message: String)

  case class PostcodeCoverage(agents: List[AgentsCoverage], message: String, status: CoverageStatus)
  case class AgentsCoverage(
      agentId: AgentId,
      agentName: String,
      deliveryMethod: String,
      nbrDeliveryDays: Integer,
      postcode: String,
      refGroupId: AgentId,
      summary: String,
  )
  object AgentsCoverage {
    implicit val config = DecoderConfiguration.lowercase
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

  implicit val config = DecoderConfiguration.snakeCase
  implicit val responseDecoder: Decoder[Response] = deriveConfiguredDecoder
  implicit val postcodeCoverageDecoder: Decoder[PostcodeCoverage] = deriveConfiguredDecoder
  implicit val coverageStatusDecoder: Decoder[CoverageStatus] = deriveEnumerationDecoder
}

object ServerStatusEndpoint {
  case class Response(statusCode: Integer, data: Server)

  case class Server(status: String)

  implicit val config = DecoderConfiguration.snakeCase
  implicit val responseDecoder: Decoder[Response] = deriveConfiguredDecoder
  implicit val serverDecoder: Decoder[Server] = deriveConfiguredDecoder
}

object PaperRound {
  case class Error(statusCode: Integer, message: String, errorCode: ZonedDateTime)
      extends Throwable(s"Error(statusCode = $statusCode, message = $message, errorCode = $errorCode)")
  object Error {
    implicit val config = DecoderConfiguration.snakeCase
    implicit val errorDecoder: Decoder[Error] = deriveConfiguredDecoder
  }
}

private object DecoderConfiguration {
  val snakeCase: Configuration = Configuration.default.withSnakeCaseMemberNames
  val lowercase: Configuration = Configuration.default.copy(transformMemberNames = _.toLowerCase)
}
