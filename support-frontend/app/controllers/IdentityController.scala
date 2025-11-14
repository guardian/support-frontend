package controllers

import actions.CustomActionBuilders
import cats.implicits._
import com.gu.monitoring.SafeLogging
import config.Configuration.IdentityUrl
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import play.api.libs.circe.Circe
import play.api.mvc._
import services.GetUserTypeError._
import services.IdentityService

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    identityUrl: IdentityUrl,
    warn: () => Try[Unit],
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SafeLogging {

  import actionRefiners._

  def warnAndReturn(): Status =
    warn().fold(
      { t =>
        logger.error(scrub"failed to send metrics", t)
        InternalServerError
      },
      _ => NotFound,
    )

  def submitMarketing(): Action[SendMarketingRequest] = PrivateAction.async(circe.json[SendMarketingRequest]) {
    implicit request =>
      val result = identityService.sendConsentPreferencesEmail(request.body.email)
      result.map { res =>
        if (res) {
          logger.info(s"Successfully sent consents preferences email for ${request.body.email}")
          Ok
        } else {
          warnAndReturn()
        }
      }
  }

  def createSignInURL(): Action[CreateSignInTokenRequest] = PrivateAction.async(circe.json[CreateSignInTokenRequest]) {
    implicit request =>
      identityService
        .createSignInToken(request.body.email)
        .fold(
          err => {
            logger.error(scrub"Failed to create a sign in token for ${request.body.email}: ${err.toString}")
            warnAndReturn()
          },
          response => {
            val signInUrl = s"${identityUrl.value}/signin?encryptedEmail=${response.encryptedEmail}"
            logger.info(s"Successfully created a sign in token for ${request.body.email}")
            Ok(CreateSignInLinkResponse(signInUrl).asJson)
          },
        )
  }

  def getNewsletters(): Action[AnyContent] = PrivateAction.async { implicit request =>
    identityService.getNewsletters().map { newsletters =>
      Ok(GetNewslettersResponse(newsletters).asJson)
    }
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

case class GetNewslettersResponse(newsletters: List[services.Newsletter])
object GetNewslettersResponse {
  implicit val newsletterEncoder: Encoder[services.Newsletter] = deriveEncoder
  implicit val encoder: Encoder[GetNewslettersResponse] = deriveEncoder
}
