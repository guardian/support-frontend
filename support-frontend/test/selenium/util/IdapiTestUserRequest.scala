package selenium.util

import okhttp3.{OkHttpClient, Request, RequestBody, MediaType, Response}
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{Json, Decoder, DecodingFailure}
import io.circe.parser.parse

import org.slf4j.LoggerFactory

object IdapiTestUserRequest {

  private val client = new OkHttpClient()

  private def logger = LoggerFactory.getLogger(this.getClass)

  private val request: Request = new Request.Builder()
    .url(Config.idapiNewTestUserUrl)
    .addHeader(Config.idapiClientAccessTokenName, Config.idapiClientAccessTokenSecret)
    .post(RequestBody.create(MediaType.parse("application/json"), "{}"))
    .build()

  private def getResult(): Either[String, Json] = {
    val response: Response = client.newCall(request).execute()
    val body: String = response.body().string()
    parse(body) match {
      case Left(error) => Left(s"Could not parse $body as JSON from response with code ${response.code()}: $error")
      case Right(json) => Right(json)
    }
  }

  def getCookies(): Either[String, List[IdapiCookie]] = {
    getResult() match {
      case Left(error) => Left(error)
      case Right(result) => {
        result.as[IdapiSuccessfulResponse] match {
          case Left(error) => Left(s"Could not deserialise IDAPI response: $error")
          case Right(r) => Right(r.values)
        }
      }
    }
  }
}

case class IdapiCookie(key: String, value: String)

object IdapiCookie {
  implicit val decoder: Decoder[IdapiCookie] = deriveDecoder[IdapiCookie]
}

case class IdapiSuccessfulResponse(values: List[IdapiCookie])

object IdapiSuccessfulResponse {
  implicit val decoder: Decoder[IdapiSuccessfulResponse] = deriveDecoder[IdapiSuccessfulResponse]
}
