package controllers

import actions.CustomActionBuilders
import com.typesafe.scalalogging.LazyLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import monitoring.SentryLogging
import play.api.mvc._
import services.IdentityService
import play.api.libs.circe.Circe
import scala.concurrent.ExecutionContext

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe with LazyLogging {

  import actionRefiners._

  def submitMarketing(): Action[SendMarketingRequest] = PrivateAction.async(circe.json[SendMarketingRequest]) { implicit request =>
    val result = identityService.sendConsentPreferencesEmail(request.body.email)
    result.map { res =>
      if (res) {
        logger.info(s"Successfully sent consents preferences email")
        Ok
      } else {
        logger.error(SentryLogging.noPii, s"Failed to send consents preferences email")
        InternalServerError
      }
    }
  }
}

object SendMarketingRequest {
  implicit val decoder: Decoder[SendMarketingRequest] = deriveDecoder
}
case class SendMarketingRequest(email: String)

