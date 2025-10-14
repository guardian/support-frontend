package services

import com.gu.monitoring.SafeLogging
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import org.joda.time.DateTime
import play.api.libs.ws.WSClient

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

case class MParticleUserProfile(
    hasMobileAppDownloaded: Boolean,
    hasFeastMobileAppDownloaded: Boolean,
)

case class MParticleAccessToken(token: String) extends AnyVal

case class OAuthTokenRequest(
    client_id: String,
    client_secret: String,
    audience: String,
    grant_type: String,
)

case class OAuthTokenResponse(
    access_token: String,
    token_type: String,
    expires_in: Int,
)

case class Identity(
    `type`: String,
    value: String,
)

case class ProfileRequest(
    environment_type: String,
    identity: Identity,
)

case class AudienceMembership(
    audience_id: Int,
)

case class ProfileResponse(
    audience_memberships: List[AudienceMembership],
)

object MParticleClient {
  implicit val oauthTokenRequestEncoder: Encoder[OAuthTokenRequest] = deriveEncoder
  implicit val oauthTokenResponseDecoder: Decoder[OAuthTokenResponse] = deriveDecoder
  implicit val identityEncoder: Encoder[Identity] = deriveEncoder
  implicit val profileRequestEncoder: Encoder[ProfileRequest] = deriveEncoder
  implicit val audienceMembershipDecoder: Decoder[AudienceMembership] = deriveDecoder
  implicit val profileResponseDecoder: Decoder[ProfileResponse] = deriveDecoder
}

class MParticleClient(
    wsClient: WSClient,
    mparticleConfigProvider: MparticleConfigProvider,
)(implicit ec: ExecutionContext)
    extends SafeLogging {

  private lazy val mparticleConfig: MparticleConfig = mparticleConfigProvider.get()

  private case class CachedToken(token: String, expiresAt: DateTime)
  private val tokenCache = new AtomicReference[Option[CachedToken]](None)
  private val safetyMargin = 2.minutes

  def getUserProfile(identityId: String): Future[Option[MParticleUserProfile]] = {
    getCachedAccessToken()
      .flatMap { accessToken =>
        callProfileAPI(identityId, accessToken.token).map(responseBody => Some(parseUserProfile(responseBody)))
      }
      .recover { case ex =>
        logger.error(scrub"Failed to get mParticle user profile: ${ex.getMessage}", ex)
        None
      }
  }

  private def safeBodyHash(body: String): String = {
    val hash = body.hashCode.abs
    s"hash=$hash"
  }

  private def getCachedAccessToken(): Future[MParticleAccessToken] = {
    val now = DateTime.now()

    tokenCache.get() match {
      case Some(cachedToken) if cachedToken.expiresAt.isAfter(now) =>
        Future.successful(MParticleAccessToken(cachedToken.token))
      case _ =>
        getAccessToken().map { case (token, expiresInSeconds) =>
          val actualExpiryTime = now.plusSeconds(expiresInSeconds)
          val safeExpiryTime = actualExpiryTime.minus(safetyMargin.toMillis)
          tokenCache.set(Some(CachedToken(token, safeExpiryTime)))
          logger.info(
            s"Cached new mParticle access token, expires at: $safeExpiryTime (${safetyMargin.toSeconds}s safety margin)",
          )
          MParticleAccessToken(token)
        }
    }
  }

  private def getAccessToken(): Future[(String, Int)] = {
    import MParticleClient._

    val request = OAuthTokenRequest(
      client_id = mparticleConfig.clientId,
      client_secret = mparticleConfig.clientSecret,
      audience = mparticleConfig.apiUrl,
      grant_type = "client_credentials",
    )

    wsClient
      .url(mparticleConfig.tokenUrl)
      .withHttpHeaders("Content-Type" -> "application/json")
      .post(request.asJson.noSpaces)
      .flatMap { response =>
        if (response.status >= 200 && response.status < 300) {
          io.circe.parser.decode[OAuthTokenResponse](response.body) match {
            case Right(tokenResponse) =>
              Future.successful((tokenResponse.access_token, tokenResponse.expires_in))
            case Left(error) =>
              val errorMsg = s"Error parsing access token response: ${error.getMessage}"
              logger.error(scrub"Error parsing access token response: ${error.getMessage}")
              Future.failed(new RuntimeException(errorMsg))
          }
        } else {
          val errorMsg = s"mParticle OAuth returned error: status=${response.status}"
          logger.warn(
            s"mParticle OAuth returned error: status=${response.status}, body_length=${response.body.length}, ${safeBodyHash(response.body)}",
          )
          Future.failed(new RuntimeException(errorMsg))
        }
      }
  }

  private def callProfileAPI(identityId: String, accessToken: String): Future[String] = {
    import MParticleClient._

    val fields = "audience_memberships"
    val url =
      s"${mparticleConfig.apiUrl}/userprofile/v1/resolve/${mparticleConfig.orgId}/${mparticleConfig.accountId}/${mparticleConfig.workspaceId}?fields=$fields"

    val request = ProfileRequest(
      environment_type = mparticleConfig.apiEnv,
      identity = Identity(`type` = "customer_id", value = identityId),
    )

    wsClient
      .url(url)
      .withHttpHeaders(
        "Authorization" -> s"Bearer $accessToken",
        "Content-Type" -> "application/json",
      )
      .post(request.asJson.noSpaces)
      .flatMap { response =>
        if (response.status >= 200 && response.status < 300) {
          Future.successful(response.body)
        } else {
          val errorMsg = s"mParticle Profile API returned error: status=${response.status}"
          logger.warn(
            s"mParticle Profile API returned error: status=${response.status}, body_length=${response.body.length}, ${safeBodyHash(response.body)}",
          )
          Future.failed(new RuntimeException(errorMsg))
        }
      }
  }

  private def parseUserProfile(responseBody: String): MParticleUserProfile = {
    import MParticleClient._

    io.circe.parser.decode[ProfileResponse](responseBody) match {
      case Right(profileResponse) =>
        val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
        val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
        MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
      case Left(error) =>
        logger.error(scrub"Error parsing mParticle response: ${error.getMessage}")
        MParticleUserProfile(hasMobileAppDownloaded = false, hasFeastMobileAppDownloaded = false)
    }
  }
}
