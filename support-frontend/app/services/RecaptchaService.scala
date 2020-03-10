package services

import cats.data.EitherT
import cats.implicits._
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}

import scala.concurrent.{ExecutionContext, Future}



case class RecaptchaResponse(success: Boolean, score: BigDecimal)
object RecaptchaResponse {
  implicit val readsGetUserTypeResponse: Reads[RecaptchaResponse] = Json.reads[RecaptchaResponse]
  implicit val getUserTypeEncoder: Encoder[RecaptchaResponse] = deriveEncoder
}

class RecaptchaService(wsClient: WSClient, secretKey: String)(implicit ec: ExecutionContext) {
  val recaptchaEndpoint = "https://www.google.com/recaptcha/api/siteverify"

  def verify(token: String): EitherT[Future, String, RecaptchaResponse] =
    wsClient.url(recaptchaEndpoint)
    .withQueryStringParameters("secret" -> secretKey, "response" -> token)
    .withHttpHeaders("Content-length" -> 0.toString )
    .withMethod("POST")
    .execute()
      .attemptT
      .leftMap(_.toString)
      .subflatMap(resp => {
        (resp.json ).validate[RecaptchaResponse].asEither.leftMap(_.mkString(","))
      })
}

