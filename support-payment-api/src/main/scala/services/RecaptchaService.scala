package services

import cats.data.{EitherT, Validated}
import cats.syntax.all._
import conf.RecaptchaConfig
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import model.stripe.StripeApiError
import model.{DefaultThreadPool, InitializationError}
import play.api.libs.json._
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

case class RecaptchaResponse(success: Boolean)
object RecaptchaResponse {
  implicit val readsGetUserTypeResponse: Reads[RecaptchaResponse] = Json.reads[RecaptchaResponse]
  implicit val getUserTypeEncoder: Encoder[RecaptchaResponse] = deriveEncoder
}

class RecaptchaService(wsClient: WSClient, config: RecaptchaConfig)(implicit ec: ExecutionContext) {
  val recaptchaEndpoint = "https://www.google.com/recaptcha/api/siteverify"

  def verify(token: String): EitherT[Future, StripeApiError, RecaptchaResponse] =
    wsClient
      .url(recaptchaEndpoint)
      .withQueryStringParameters("secret" -> config.secretKey, "response" -> token)
      .withHttpHeaders("Content-length" -> 0.toString)
      .withMethod("POST")
      .execute()
      .attemptT
      .leftMap(err => StripeApiError.fromString(err.toString, None))
      .subflatMap { resp =>
        resp.json
          .validate[RecaptchaResponse]
          .asEither
          .leftMap { err =>
            StripeApiError.fromString(err.mkString(","), None)
          }
      }
}

object RecaptchaService {
  def fromRecaptchaConfig(config: RecaptchaConfig)(implicit ws: WSClient, pool: DefaultThreadPool) =
    Validated
      .catchNonFatal {
        new RecaptchaService(ws, config)
      }
      .leftMap { err =>
        InitializationError(
          s"unable to instantiate RecaptchaService for config: $config. Error trace: ${err.getMessage}",
        )
      }
}
