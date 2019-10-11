package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.RemindMeService
import utils.{InvalidEmail, ValidEmail, ValidateEmail}

import scala.concurrent.{ExecutionContext, Future}

class ReminderController(components: ControllerComponents,
                         actionRefiners: CustomActionBuilders,
                         sendReminderEmail: RemindMeService)
                        (implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._

  def sendReminderCreatedEvent(): Action[ReminderEventRequest] = PrivateAction.async(circe.json[ReminderEventRequest]) { implicit request =>

    val email = request.body.email

    ValidateEmail(email) match {
      case ValidEmail(ve) => sendToLambda(ve)
      case InvalidEmail => respondWithBadRequest(s"Bad Request: Regex match failed for email: $email")
    }
  }

  private def respondWithBadRequest(message: String) = {
    SafeLogger.warn(message)
    Future.successful(BadRequest(message))
  }

  private def sendToLambda(email: String) =
    sendReminderEmail(email).map(res => if (res) Ok else internalServerError(s"Internal Server Error: Request failed for: $email"))

  private def internalServerError(message: String) = {
    SafeLogger.warn(message)
    InternalServerError(message)
  }
}

case class ReminderEventRequest(email: String)
object ReminderEventRequest {
  implicit val decoder: Decoder[ReminderEventRequest] = deriveDecoder
}
