package services

import cats.data.EitherT
import cats.implicits._
import com.gu.support.touchpoint.TouchpointService
import play.api.libs.json.{JsPath, Json, JsonValidationError, Reads}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}

import scala.collection.Seq
import scala.concurrent.{ExecutionContext, Future}

case class UserBenefitsResponse(benefits: List[String])
object UserBenefitsResponse {
  implicit val readsUserBenefitsResponse: Reads[UserBenefitsResponse] = Json.reads[UserBenefitsResponse]
}

sealed trait UserBenefitsError {
  def describeError: String
}

object UserBenefitsError {
  case class CallFailed(error: Throwable) extends UserBenefitsError {
    override def describeError: String = s"Call failed with error: ${error.getMessage}"
  }

  case class GotErrorResponse(response: WSResponse) extends UserBenefitsError {
    override def describeError: String = s"Got error response: ${response.status} ${response.body}"
  }

  case class DecodeFailed(decodeErrors: Seq[(JsPath, Seq[JsonValidationError])]) extends UserBenefitsError {
    override def describeError: String = s"Failed to decode response: ${decodeErrors.mkString(",")}"
  }
}

class UserBenefitsApiService(host: String, apiKey: String)(implicit wsClient: WSClient) extends TouchpointService {
  def getUserBenefits(
      identityId: String,
  )(implicit ec: ExecutionContext): EitherT[Future, UserBenefitsError, UserBenefitsResponse] = {
    request(s"benefits/$identityId")
      .get()
      .attemptT
      .leftMap(UserBenefitsError.CallFailed)
      .subflatMap(resp =>
        if (resp.status >= 300) {
          Left(UserBenefitsError.GotErrorResponse(resp))
        } else {
          resp.json.validate[UserBenefitsResponse].asEither.leftMap(UserBenefitsError.DecodeFailed)
        },
      )
  }

  private def request(path: String): WSRequest = {
    wsClient
      .url(s"https://$host/$path")
      .withHttpHeaders("x-api-key" -> apiKey)
  }
}
