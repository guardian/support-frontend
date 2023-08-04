package selenium.util

import cats.syntax.either._
import io.circe.generic.semiauto.deriveDecoder
import io.circe.parser.parse
import io.circe.{Decoder, Json}
import okhttp3._

class IdapiTestUserRequest {

  private def getResult: Either[String, Json] = {
    val response: Response = IdapiTestUserRequest.client.newCall(IdapiTestUserRequest.request).execute()
    val body: String = response.body().string()
    parse(body).leftMap { error =>
      s"Could not parse $body as JSON from response with code ${response.code()}: $error"
    }
  }

  def getCookies(): Either[String, List[IdapiCookie]] = {
    getResult match {
      case Left(error) => Left(error)
      case Right(result) => {
        result.as[IdapiSuccessfulResponse] match {
          case Left(error) => Left(s"Could not deserialise IDAPI response: $error from json: ${result}")
          case Right(r) => Right(r.values)
        }
      }
    }
  }
}

object IdapiTestUserRequest {

  private val client = new OkHttpClient()

  private val request: Request = new Request.Builder()
    .url(Config.idapiNewTestUserUrl)
    .addHeader(Config.idapiClientAccessTokenName, Config.idapiClientAccessTokenSecret)
    .post(RequestBody.create(MediaType.parse("application/json"), "{}"))
    .build()
}

case class IdapiCookie(key: String, value: String)

object IdapiCookie {
  implicit val decoder: Decoder[IdapiCookie] = deriveDecoder[IdapiCookie]
}

case class IdapiSuccessfulResponse(values: List[IdapiCookie])

object IdapiSuccessfulResponse {
  implicit val decoder: Decoder[IdapiSuccessfulResponse] = deriveDecoder[IdapiSuccessfulResponse]
}
