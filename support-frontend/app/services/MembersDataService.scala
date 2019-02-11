package services

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal
import play.api.libs.json.{JsPath, JsValue, Json, OFormat, Reads, JsonValidationError => PlayJsonValidationError}
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.http.Status
import cats.data.EitherT
import cats.syntax.either._
import com.gu.identity.play.AccessCredentials

import scala.util.{Failure, Success, Try}

object MembersDataService {

  object ContentAccess {
    implicit val jf: OFormat[ContentAccess] = Json.format[ContentAccess]
  }

  case class ContentAccess(recurringContributor: Boolean)

  object UserAttributes {
    implicit val jf: OFormat[UserAttributes] = Json.format[UserAttributes]
  }

  case class UserAttributes(userId: String, contentAccess: ContentAccess)

  trait MembersDataServiceError

  object UserNotFound extends MembersDataServiceError

  case class JsonValidationError(errors: Seq[(JsPath, Seq[PlayJsonValidationError])]) extends MembersDataServiceError

  case class UnexpectedResponseStatus(statusCode: Int) extends MembersDataServiceError

  case class JsonParseError(e: Throwable) extends MembersDataServiceError

  case class WSClientError(e: Throwable) extends MembersDataServiceError

  def apply(apiUrl: String)(implicit ec: ExecutionContext, wsClient: WSClient): MembersDataService = new MembersDataService(apiUrl)
}

class MembersDataService(apiUrl: String)(implicit val ec: ExecutionContext, wsClient: WSClient) {

  import MembersDataService._

  def userAttributes(implicit accessCredentials: AccessCredentials.Cookies): EitherT[Future, MembersDataServiceError, UserAttributes] =
    get[UserAttributes](s"$apiUrl/user-attributes/me")

  private def get[T](url: String)(implicit credentials: AccessCredentials.Cookies, reader: Reads[T]): EitherT[Future, MembersDataServiceError, T] = EitherT {
    wsClient
      .url(url)
      .withHttpHeaders("Cookie" -> credentials.cookies.map(c => s"${c.name}=${c.value}").mkString("; "))
      .withRequestTimeout(2.second)
      .get()
      .map(responseAsJson[T])
      .recover {
        case NonFatal(e) => WSClientError(e).asLeft
      }
  }

  private def responseAsJson[T](response: WSResponse)(implicit reader: Reads[T]) = response.status match {
    case Status.OK =>
      for {
        json <- parseJson(response)
        obj <- validateJson[T](json)
      } yield obj

    case Status.NOT_FOUND => UserNotFound.asLeft

    case _ => UnexpectedResponseStatus(response.status).asLeft
  }

  private def parseJson(response: WSResponse) = Try { response.json } match {
    case Success(json) => json.asRight
    case Failure(e) => JsonParseError(e).asLeft
  }

  private def validateJson[T](json: JsValue)(implicit reader: Reads[T]) =
    json.validate[T].asEither.leftMap(JsonValidationError.apply)

}
