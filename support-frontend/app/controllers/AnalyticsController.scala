package controllers

import actions.CustomActionBuilders
import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import com.gu.identity.model.User
import com.gu.monitoring.SafeLogging
import io.circe.{Encoder, Json}
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import play.api.mvc.Security.AuthenticatedRequest
import services.{MParticleClient, MParticleUserProfile}

import scala.concurrent.{ExecutionContext, Future}

case class AnalyticsUserProfileResponse(
    identityId: String,
    hasMobileAppDownloaded: Boolean,
    hasFeastMobileAppDownloaded: Boolean,
    isPastSingleContributor: Boolean,
)

object AnalyticsUserProfileResponse {
  implicit val encoder: Encoder[AnalyticsUserProfileResponse] = deriveEncoder
}

class AnalyticsController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    mparticleClient: MParticleClient,
)(implicit val exec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SafeLogging {

  import actionRefiners._
  import AnalyticsUserProfileResponse._

  type AuthenticatedUserRequest[A] = AuthenticatedRequest[A, User]

  private val RequireAuthenticatedUser = new ActionRefiner[OptionalAuthRequest, AuthenticatedUserRequest] {
    override protected def executionContext: ExecutionContext = exec

    override protected def refine[A](
        request: OptionalAuthRequest[A],
    ): Future[Either[Result, AuthenticatedUserRequest[A]]] =
      request.user match {
        case Some(user) => Future.successful(Right(new AuthenticatedRequest(user, request)))
        case None =>
          logger.warn("getAnalyticsUserProfile called but user is not authenticated")
          Future.successful(Left(Unauthorized("User must be authenticated to access this endpoint")))
      }
  }

  def getAnalyticsUserProfile(): Action[AnyContent] =
    (MaybeAuthenticatedAction andThen RequireAuthenticatedUser).async { implicit request =>
      for {
        userProfile <- mparticleClient.getUserProfile(request.user.id).recover { case ex =>
          logger.error(scrub"Failed to get mParticle user profile: ${ex.getMessage}", ex)
          MParticleUserProfile(
            hasMobileAppDownloaded = false,
            hasFeastMobileAppDownloaded = false,
            isPastSingleContributor = false,
          )
        }
      } yield {
        val response = AnalyticsUserProfileResponse(
          identityId = request.user.id,
          hasMobileAppDownloaded = userProfile.hasMobileAppDownloaded,
          hasFeastMobileAppDownloaded = userProfile.hasFeastMobileAppDownloaded,
          isPastSingleContributor = userProfile.isPastSingleContributor,
        )
        Ok(response.asJson)
      }
    }
}
