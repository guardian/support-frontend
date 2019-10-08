package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import codecs.CirceDecoders._
import services.SendReminderEmailService

import scala.concurrent.{ExecutionContext, Future}

class ReminderController(components: ControllerComponents,
                         actionRefiners: CustomActionBuilders,
                         sendReminderEmail: SendReminderEmailService)
                        (implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._

  def reminderEvent(): Action[ReminderEventRequest] = PrivateAction.async(circe.json[ReminderEventRequest]) { implicit request =>

    val result = sendReminderEmail(request.body.email)
    result.map { res =>
      if (res) {
        SafeLogger.info(s"Successfully sent email to lambda for persistence ${request.body.email}")
        Ok
      }
      else {
        InternalServerError("Unable to save email address")
      }
    }
  }
}

case class ReminderEventRequest(email: String)
object ReminderEventRequest {
  implicit val decoder: Decoder[ReminderEventRequest] = deriveDecoder
}
