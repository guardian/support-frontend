package controllers

import actions.CustomActionBuilders
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.mvc._
import services.IdentityService
import play.api.libs.circe.Circe
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
        InternalServerError
      }
    }
  }
}

object SendMarketingRequest {
  implicit val decoder: Decoder[SendMarketingRequest] = deriveDecoder
}
case class SendMarketingRequest(email: String)

