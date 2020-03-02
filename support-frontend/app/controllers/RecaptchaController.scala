package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.CaptchaService

import scala.concurrent.{ExecutionContext, Future}

case class CaptchaRequest(token: String)
object CaptchaRequest {
  implicit val decoder: Decoder[CaptchaRequest] = deriveDecoder
}

case class RecaptchaResponse(success: Boolean, score: BigDecimal)
object RecaptchaResponse {
  implicit val encoder: Encoder[RecaptchaResponse] = deriveEncoder
}

class RecaptchaController(
  components: ControllerComponents,
  actionRefiners: CustomActionBuilders,
  captchaService: CaptchaService
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {
  import actionRefiners._
  def verify(): Action[CaptchaRequest] = PrivateAction.async(circe.json[CaptchaRequest]) { implicit request =>
    val token = request.body.token
    captchaService.verify(token)
  }
}

