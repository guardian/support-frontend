package controllers

import actions.CustomActionBuilders
import cats.implicits._
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.CaptchaService

import scala.concurrent.{ExecutionContext, Future}

case class CaptchaRequest(token: String)
object CaptchaRequest {
  implicit val decoder: Decoder[CaptchaRequest] = deriveDecoder
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
      Ok(res.score.toString)
    } // ToDo we don't want to return the score to the front-end - just track it? 
    Future(Ok)
  }
}

