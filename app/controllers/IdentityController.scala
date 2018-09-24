package controllers

import actions.CustomActionBuilders
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.mvc._
import play.api.libs.circe.Circe
import services.IdentityService

import scala.concurrent.ExecutionContext

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._

  def submitMarketing(): Action[SendMarketingRequest] = PrivateAction.async(circe.json[SendMarketingRequest]) { implicit request =>
    val result = identityService.sendConsentPreferencesEmail(request.body.email)
    result.map { res =>
      if (res) {
        SafeLogger.info("Successfully sent consents preferences email")
        Ok
      } else {
        SafeLogger.error(scrub"Failed to send consents preferences email")
        BadRequest
      }
    }
  }

  def setPasswordGuest(): Action[SetPasswordRequest] = PrivateAction.async(circe.json[SetPasswordRequest]) { implicit request =>
    val result = identityService.setPasswordGuest(request.body.password, request.body.guestAccountRegistrationToken)
    result.map { res =>
      if (res) {
        SafeLogger.info("Successfully set password")
        Ok
      } else {
        SafeLogger.error(scrub"Failed to set password")
        BadRequest
      }
    }
  }
}

object SendMarketingRequest {
  implicit val decoder: Decoder[SendMarketingRequest] = deriveDecoder
}
case class SendMarketingRequest(email: String)

object SetPasswordRequest {
  implicit val decoder: Decoder[SetPasswordRequest] = deriveDecoder
}
case class SetPasswordRequest(password: String, guestAccountRegistrationToken: String)

