package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogging
import config.MparticleConfigProvider
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import java.util.concurrent.atomic.AtomicReference
import org.joda.time.DateTime
import scala.concurrent.duration._

class AnalyticsController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    wsClient: WSClient,
    mparticleConfigProvider: MparticleConfigProvider,
)(implicit val exec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SafeLogging {

  import actionRefiners._

  private lazy val mparticleConfig = mparticleConfigProvider.get()

  private case class CachedToken(token: String, expiresAt: DateTime)
  private val tokenCache = new AtomicReference[Option[CachedToken]](None)
  private val cacheExpirationHours = 6.hours

  private def clearTokenCache(): Unit = {
    tokenCache.set(None)
    logger.info("mParticle access token cache cleared")
  }

  def getAnalyticsUserProfile(): Action[AnyContent] = MaybeAuthenticatedAction.async { implicit request =>
    request.user match {
      case Some(user) =>
        callMparticleProfileAPI(user.id).flatMap { mparticleResponse =>
          import io.circe.Json

          val (hasMobileApp, hasFeastApp) = mparticleResponse match {
            case Some(responseBody) =>
              try {
                val json = io.circe.parser.parse(responseBody).getOrElse(Json.Null)
                val cursor = json.hcursor

                val audienceMemberships = cursor.downField("audience_memberships").as[List[Json]].getOrElse(List.empty)

                val hasMobileAppDownloaded = audienceMemberships.exists { membership =>
                  membership.hcursor.get[Int]("audience_id").contains(22581)
                }

                val hasFeastMobileAppDownloaded = audienceMemberships.exists { membership =>
                  membership.hcursor.get[Int]("audience_id").contains(22582)
                }

                (hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
              } catch {
                case ex: Exception =>
                  logger.error(scrub"Error parsing mParticle response: ${ex.getMessage}", ex)
                  (false, false)
              }
            case None =>
              logger.warn("No mParticle response received")
              (false, false)
          }

          val response = Json.obj(
            "identityId" -> Json.fromString(user.id),
            "status" -> Json.fromString("success"),
            "message" -> Json.fromString("Analytics user profile endpoint called successfully"),
            "hasMobileAppDownloaded" -> Json.fromBoolean(hasMobileApp),
            "hasFeastMobileAppDownloaded" -> Json.fromBoolean(hasFeastApp),
          )

          Future.successful(Ok(response))
        }

      case None =>
        logger.warn("getAnalyticsUserProfile called but user is not authenticated")
        Future.successful(Unauthorized("User must be authenticated to access this endpoint"))
    }
  }

  private def callMparticleProfileAPI(identityId: String): Future[Option[String]] = {
    getCachedMparticleAccessToken().flatMap {
      case Some(accessToken) =>
        callProfileAPIWithToken(identityId, accessToken)
      case None =>
        logger.error(scrub"Failed to obtain mParticle access token")
        Future.successful(None)
    }
  }

  private def getCachedMparticleAccessToken(): Future[Option[String]] = {
    val now = DateTime.now()

    tokenCache.get() match {
      case Some(cachedToken) if cachedToken.expiresAt.isAfter(now) =>
        Future.successful(Some(cachedToken.token))
      case _ =>
        getMparticleAccessToken().map { tokenOpt =>
          tokenOpt.foreach { token =>
            val expiresAt = now.plus(cacheExpirationHours.toMillis)
            tokenCache.set(Some(CachedToken(token, expiresAt)))
            logger.info(s"Cached new mParticle access token, expires at: $expiresAt")
          }
          tokenOpt
        }
    }
  }

  private def getMparticleAccessToken(): Future[Option[String]] = {
    val clientId = mparticleConfig.clientId
    val clientSecret = mparticleConfig.clientSecret
    val audience = mparticleConfig.apiUrl
    val grantType = "client_credentials"
    val tokenUrl = mparticleConfig.tokenUrl

    import io.circe.Json

    val requestBody = Json.obj(
      "client_id" -> Json.fromString(clientId),
      "client_secret" -> Json.fromString(clientSecret),
      "audience" -> Json.fromString(audience),
      "grant_type" -> Json.fromString(grantType),
    )

    wsClient
      .url(tokenUrl)
      .withHttpHeaders("Content-Type" -> "application/json")
      .post(requestBody.toString())
      .map { response =>
        if (response.status >= 200 && response.status < 300) {
          try {
            val json = io.circe.parser.parse(response.body).getOrElse(Json.Null)
            val cursor = json.hcursor
            cursor.get[String]("access_token").toOption
          } catch {
            case ex: Exception =>
              logger.error(scrub"Error parsing access token response: ${ex.getMessage}", ex)
              None
          }
        } else {
          logger.warn(s"mParticle OAuth returned error: ${response.status} - ${response.body}")
          None
        }
      }
      .recover { case ex =>
        logger.error(scrub"Error calling mParticle OAuth endpoint: ${ex.getMessage}", ex)
        None
      }
  }

  private def callProfileAPIWithToken(identityId: String, accessToken: String): Future[Option[String]] = {
    val identityId = "113817744" // Remove

    val orgId = mparticleConfig.orgId
    val accountId = mparticleConfig.accountId
    val workspaceId = mparticleConfig.workspaceId
    val apiUrl = mparticleConfig.apiUrl
    val environmentType = mparticleConfig.apiEnv

    val fields = "audience_memberships"
    val url = s"$apiUrl/userprofile/v1/resolve/$orgId/$accountId/$workspaceId?fields=$fields"
    val requestBody = s"""{
      "environment_type": "$environmentType",
      "identity": {"type":"customer_id","value":"$identityId"}
    }"""

    wsClient
      .url(url)
      .withHttpHeaders(
        "Authorization" -> s"Bearer $accessToken",
        "Content-Type" -> "application/json",
      )
      .post(requestBody)
      .map { response =>
        if (response.status >= 200 && response.status < 300) {
          Some(response.body)
        } else {
          logger.warn(s"mParticle Profile API returned error: ${response.status} - ${response.body}")
          None
        }
      }
      .recover { case ex =>
        logger.error(scrub"Error calling mParticle Profile API: ${ex.getMessage}", ex)
        None
      }
  }
}
