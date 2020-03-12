package controllers

import actions.CustomActionBuilders
import cats.implicits._
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto._
import io.circe.{Decoder, Encoder}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.RecaptchaService

import scala.concurrent.ExecutionContext

case class RecaptchaRequest(token: String)
object RecaptchaRequest {
  implicit val decoder: Decoder[RecaptchaRequest] = deriveDecoder
}

case class RecaptchaResponse(isLowRisk: Boolean)

object RecaptchaResponse {
  implicit val encoder: Encoder[RecaptchaResponse] = deriveEncoder
}

class RecaptchaController(
                           components: ControllerComponents,
                           actionRefiners: CustomActionBuilders,
                           recaptchaService: RecaptchaService,
                           v2RecaptchaKey: String,
                           v3RecaptchaKey: String
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  import RecaptchaResponse.encoder
  import io.circe.syntax._
  import actionRefiners._

  def v3Verify(): Action[RecaptchaRequest] = PrivateAction.async(circe.json[RecaptchaRequest]) { implicit request =>
    val token = request.body.token
    recaptchaService
      .verify(token, v3RecaptchaKey)
      .fold(
        err => {
          logger.warn(s"Recaptcha response error: $err")
          InternalServerError},
        res => Ok(RecaptchaResponse((res.score.getOrElse(BigDecimal(0)) > 0.1)).asJson))
  }

  def v2Verify(): Action[RecaptchaRequest] = PrivateAction.async(circe.json[RecaptchaRequest]) { implicit request =>
    val token = request.body.token
    recaptchaService
      .verify(token, "v2PrivateKey")
      .fold(
        err => {
          logger.warn(s"Recaptcha response error: $err")
          InternalServerError},
        res => Ok(RecaptchaResponse(res.success).asJson))
  }
}

