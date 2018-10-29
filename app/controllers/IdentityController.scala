package controllers

import actions.CustomActionBuilders
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.mvc._
import play.api.libs.circe.Circe
import services.IdentityService
import cats.implicits._
import config.Configuration.GuardianDomain
import models.identity.responses.SetGuestPasswordResponseCookies
import codecs.CirceDecoders._

import scala.concurrent.{ExecutionContext, Future}

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    guardianDomain: GuardianDomain
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._

  def submitMarketing(): Action[SendMarketingRequest] = PrivateAction.async(circe.json[SendMarketingRequest]) { implicit request =>
    val result = identityService.sendConsentPreferencesEmail(request.body.email)
    result.map { res =>
      if (res) {
        SafeLogger.info(s"Successfully sent consents preferences email for ${request.body.email}")
        Ok
      } else {
        SafeLogger.error(scrub"Failed to send consents preferences email for ${request.body.email}")
        InternalServerError
      }
    }
  }

  def setPasswordGuest(): Action[SetPasswordRequest] = PrivateAction.async(circe.json[SetPasswordRequest]) { implicit request =>
    identityService
      .setPasswordGuest(request.body.password, request.body.guestAccountRegistrationToken)
      .fold(
        err => {
          SafeLogger.error(scrub"Failed to set password using guest account registration token ${request.body.guestAccountRegistrationToken}: ${err.toString}")
          InternalServerError
        },
        cookiesFromResponse => {
          SafeLogger.info(s"Successfully set password using guest account registration token ${request.body.guestAccountRegistrationToken}")
          Ok.withCookies(SetGuestPasswordResponseCookies.getCookies(cookiesFromResponse, guardianDomain): _*)
        }
      )
  }

  def getUserType(maybeEmail: Option[String]): Action[AnyContent] = PrivateAction.async { implicit request =>
    maybeEmail.fold {
      SafeLogger.error(scrub"No email provided")
      Future.successful(InternalServerError.asInstanceOf[Result])
    } { email =>
      identityService
        .getUserType(email)
        .fold(
          err => {
            SafeLogger.error(scrub"Failed to retrieve user type for ${email}: ${err.toString}")
            InternalServerError
          },
          response => {
            SafeLogger.info(s"Successfully retrieved user type for ${email}")
            Ok(response.asJson)
          }
        )
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
