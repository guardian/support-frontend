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



class CaptchaService(wsClient: WSClient)(implicit ec: ExecutionContext) {
  val captchaEndpoint = "https://www.google.com/recaptcha/api/siteverify"
  val secret = "???"

  def verify(token: String): EitherT[Future, String, RecaptchaResponse] =
    wsClient.url(captchaEndpoint)
    .withQueryStringParameters("secret" -> secret, "response" -> token)
    .withMethod("POST")
    .execute()
      .attemptT
      .leftMap(_.toString)
      .subflatMap(resp => (resp.json ).validate[RecaptchaResponse].asEither.leftMap(_.mkString(",")))
}

