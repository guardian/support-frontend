package controllers

import actions.CustomActionBuilders
import cats.implicits._
import io.circe.generic.semiauto._
import io.circe.{Decoder, Encoder}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.CaptchaService

import scala.concurrent.ExecutionContext

case class CaptchaRequest(token: String)
object CaptchaRequest {
  implicit val decoder: Decoder[CaptchaRequest] = deriveDecoder
}

case class CaptchaResponse(allow: Boolean)

object CaptchaResponse {
  implicit val encoder: Encoder[CaptchaResponse] = deriveEncoder
}

class RecaptchaController(
  components: ControllerComponents,
  actionRefiners: CustomActionBuilders,
  captchaService: CaptchaService
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {
  import actionRefiners._
  def verify(): Action[CaptchaRequest] = PrivateAction.async(circe.json[CaptchaRequest]) { implicit request =>
    val token = request.body.token
    captchaService
      .verify(token
      ).map { res =>
      Ok(CaptchaResponse(res.score > 0.1))
    }
  }
}

