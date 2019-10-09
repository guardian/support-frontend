package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.RemindMeService

import scala.concurrent.ExecutionContext

class ReminderController(components: ControllerComponents,
                         actionRefiners: CustomActionBuilders,
                         sendReminderEmail: RemindMeService)
                        (implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._

  def sendReminderCreatedEvent(): Action[ReminderEventRequest] = PrivateAction.async(circe.json[ReminderEventRequest]) { implicit request =>

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
