package services

import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogging
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import play.api.libs.json._
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

case class RecaptchaResponse(success: Boolean, `error-codes`: Option[List[String]])
object RecaptchaResponse {
  implicit val readsGetUserTypeResponse: Reads[RecaptchaResponse] = Json.reads[RecaptchaResponse]
  implicit val getUserTypeEncoder: Encoder[RecaptchaResponse] = deriveEncoder
  val recaptchaFailedCode: String = "recaptcha_validation_failed"
}

class RecaptchaService(wsClient: WSClient)(implicit ec: ExecutionContext) extends SafeLogging {
  val recaptchaEndpoint: String = "https://www.google.com/recaptcha/api/siteverify"

  def verify(token: String, secretKey: String): EitherT[Future, String, RecaptchaResponse] =
    wsClient
      .url(recaptchaEndpoint)
      .withQueryStringParameters("secret" -> secretKey, "response" -> token)
      .withHttpHeaders("Content-length" -> 0.toString)
      .withMethod("POST")
      .execute()
      .attemptT
      .leftMap { err =>
        logger.error(scrub"Recaptcha failed on ${err.toString}")
        err.toString
      }
      .subflatMap(resp => {
        logger.info(s"Recaptcha response: ${resp.json}")
        resp.json.validate[RecaptchaResponse].asEither.leftMap(_.mkString(","))
      })
}
