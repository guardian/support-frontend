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

  private def getOrigin(request: RequestHeader): String = {
    s"https://${request.host}"
  }

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

  def getNewslettersSubscriptions(): Action[AnyContent] = PrivateAction.async { implicit request =>
    request.cookies.get("GU_ACCESS_TOKEN") match {
      case Some(cookie) =>
        val origin = getOrigin(request)
        identityService
          .getNewslettersSubscriptions(cookie.value, origin)
          .map(
            _.fold(
              error => {
                logger.error(scrub"Failed to get newsletters subscriptions: $error")
                BadRequest(
                  GetNewslettersResponse(None, Some(List("Failed to retrieve newsletter subscriptions"))).asJson,
                )
              },
              newsletters => Ok(GetNewslettersResponse(Some(newsletters), None).asJson),
            ),
          )
      case None =>
        logger.error(scrub"No GU_ACCESS_TOKEN cookie found")
        Future.successful(Unauthorized("No access token found"))
    }
  }

  def updateNewsletterSubscription(): Action[UpdateNewsletterRequest] =
    PrivateAction.async(circe.json[UpdateNewsletterRequest]) { implicit request =>
      request.cookies.get("GU_ACCESS_TOKEN") match {
        case Some(cookie) =>
          val origin = getOrigin(request)
          identityService
            .updateNewsletterSubscription(cookie.value, request.body.id, request.body.subscribed, origin)
            .map { success =>
              if (success) {
                NoContent
              } else {
                InternalServerError("Failed to update newsletter subscription")
              }
            }
        case None =>
          logger.error(scrub"No GU_ACCESS_TOKEN cookie found")
          Future.successful(Unauthorized("No access token found"))
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

case class GetNewslettersResponse(newsletters: Option[List[services.Newsletter]], errors: Option[List[String]])
object GetNewslettersResponse {
  implicit val newsletterEncoder: Encoder[services.Newsletter] = deriveEncoder
  implicit val encoder: Encoder[GetNewslettersResponse] =
    deriveEncoder[GetNewslettersResponse].mapJson(_.dropNullValues)
}

case class UpdateNewsletterRequest(id: String, subscribed: Boolean)
object UpdateNewsletterRequest {
  implicit val decoder: Decoder[UpdateNewsletterRequest] = deriveDecoder
}
