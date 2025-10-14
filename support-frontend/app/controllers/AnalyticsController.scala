package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogging
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.MParticleClient

import scala.concurrent.{ExecutionContext, Future}

class AnalyticsController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    mparticleClient: MParticleClient,
)(implicit val exec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SafeLogging {

  import actionRefiners._

  def getAnalyticsUserProfile(): Action[AnyContent] = MaybeAuthenticatedAction.async { implicit request =>
    request.user match {
      case Some(user) =>
        mparticleClient.getUserProfile(user.id).map {
          case Some(userProfile) =>
            import io.circe.Json
            val response = Json.obj(
              "identityId" -> Json.fromString(user.id),
              "status" -> Json.fromString("success"),
              "message" -> Json.fromString("Analytics user profile endpoint called successfully"),
              "hasMobileAppDownloaded" -> Json.fromBoolean(userProfile.hasMobileAppDownloaded),
              "hasFeastMobileAppDownloaded" -> Json.fromBoolean(userProfile.hasFeastMobileAppDownloaded),
            )
            Ok(response)
          case None =>
            logger.warn("No mParticle response received")
            import io.circe.Json
            val response = Json.obj(
              "identityId" -> Json.fromString(user.id),
              "status" -> Json.fromString("success"),
              "message" -> Json.fromString("Analytics user profile endpoint called successfully"),
              "hasMobileAppDownloaded" -> Json.fromBoolean(false),
              "hasFeastMobileAppDownloaded" -> Json.fromBoolean(false),
            )
            Ok(response)
        }

      case None =>
        logger.warn("getAnalyticsUserProfile called but user is not authenticated")
        Future.successful(Unauthorized("User must be authenticated to access this endpoint"))
    }
  }
}
