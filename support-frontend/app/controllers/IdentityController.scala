package controllers

import actions.CustomActionBuilders
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import play.api.mvc._
import play.api.libs.circe.Circe
import services.{IdentityService}
import cats.implicits._
import config.Configuration.{GuardianDomain, IdentityUrl}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    guardianDomain: GuardianDomain,
    identityUrl: IdentityUrl,
    warn: () => Try[Unit]
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  import actionRefiners._

  def warnAndReturn(): Status =
    warn().fold({ t =>
      SafeLogger.error(scrub"failed to send metrics", t)
      InternalServerError
    }, _ => NotFound)

  def submitMarketing(): Action[SendMarketingRequest] = PrivateAction.async(circe.json[SendMarketingRequest]) { implicit request =>
    val result = identityService.sendConsentPreferencesEmail(request.body.email)
    result.map { res =>
      if (res) {
        SafeLogger.info(s"Successfully sent consents preferences email for ${request.body.email}")
        Ok
      } else {
        warnAndReturn()
      }
    }
  }

  def getUserType(maybeEmail: Option[String]): Action[AnyContent] = PrivateAction.async { implicit request =>
    maybeEmail.fold {
      SafeLogger.error(scrub"No email provided")
      Future.successful(BadRequest("No email provided"))
    } { email =>
      identityService
        .getUserType(email)
        .fold(
          err => {
            SafeLogger.error(scrub"Failed to retrieve user type for $email: ${err.toString}")
            InternalServerError
          },
          response => {
            SafeLogger.info(s"Successfully retrieved user type for $email")
            SafeLogger.info(s"USERTYPE: $response")
            Ok(response.asJson)
          }
        )
    }
  }

  def createSignInURL(): Action[CreateSignInTokenRequest] = PrivateAction.async(circe.json[CreateSignInTokenRequest]) { implicit request =>
    identityService
      .createSignInToken(request.body.email)
      .fold(
        err => {
          SafeLogger.error(scrub"Failed to create a sign in token for ${request.body.email}: ${err.toString}")
          warnAndReturn()
        },
        response => {
          val signInUrl = s"${identityUrl.value}/signin?encryptedEmail=${response.encryptedEmail}"
          SafeLogger.info(s"Successfully created a sign in token for ${request.body.email}")
          Ok(CreateSignInLinkResponse(signInUrl).asJson)
        }
      )
  }
}

case class SendMarketingRequest(email: String)
object SendMarketingRequest {
  implicit val decoder: Decoder[SendMarketingRequest] = deriveDecoder
}

case class SetPasswordRequest(password: String, guestAccountRegistrationToken: String)
object SetPasswordRequest {
  implicit val decoder: Decoder[SetPasswordRequest] = deriveDecoder
}

case class CreateSignInTokenRequest(email: String)
object CreateSignInTokenRequest {
  implicit val decoder: Decoder[CreateSignInTokenRequest] = deriveDecoder
}

case class CreateSignInLinkResponse(signInLink: String)
object CreateSignInLinkResponse {
  implicit val encoder: Encoder[CreateSignInLinkResponse] = deriveEncoder
}
