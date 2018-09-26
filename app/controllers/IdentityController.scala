package controllers

import actions.CustomActionBuilders
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import models.identity.responses.IdentityApiResponseError
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.mvc._
import play.api.libs.circe.Circe
import services.IdentityService
import codecs.CirceDecoders._

import scala.concurrent.ExecutionContext

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._
  import cats.implicits._

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

  def setPasswordGuest(): Action[SetPasswordRequest] = PrivateAction.async(circe.json[SetPasswordRequest]) { implicit request =>
    identityService
      .setPasswordGuest(request.body.password, request.body.guestAccountRegistrationToken)
      .fold(
        err => {
          SafeLogger.error(scrub"Failed to set password")
          InternalServerError(err.asJson)
        },
        cookies =>  {
          SafeLogger.info("Successfully set passwrod")
          Ok(cookies.asJson)
        }
      )
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
