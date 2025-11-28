package services

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import org.joda.time.DateTime

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
    access_token: MParticleAccessToken,
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

case class MParticleError(message: String) extends Throwable(message)

object MParticleClient {
  implicit val oauthTokenRequestEncoder: Encoder[OAuthTokenRequest] = deriveEncoder
  implicit val mParticleAccessTokenDecoder: Decoder[MParticleAccessToken] =
    Decoder[String].map(MParticleAccessToken.apply)
  implicit val oauthTokenResponseDecoder: Decoder[OAuthTokenResponse] = deriveDecoder
  implicit val identityEncoder: Encoder[Identity] = deriveEncoder
  implicit val profileRequestEncoder: Encoder[ProfileRequest] = deriveEncoder
  implicit val audienceMembershipDecoder: Decoder[AudienceMembership] = deriveDecoder
  implicit val profileResponseDecoder: Decoder[ProfileResponse] = deriveDecoder
  implicit val mparticleErrorDecoder: Decoder[MParticleError] = deriveDecoder
}

class MParticleAuthClient(
    val httpClient: FutureHttpClient,
    config: MparticleConfig,
)(implicit ec: ExecutionContext)
    extends SafeLogging {

  import MParticleClient._

  private case class CachedToken(token: String, expiresAt: DateTime)
  private val tokenCache = new AtomicReference[Option[CachedToken]](None)
  private val safetyMargin = 2.minutes

  def getCachedAccessToken(): Future[MParticleAccessToken] = {
    val now = DateTime.now()

    tokenCache.get() match {
      case Some(cachedToken) if cachedToken.expiresAt.isAfter(now) =>
        Future.successful(MParticleAccessToken(cachedToken.token))
      case _ =>
        getAccessToken().map { case (accessToken, expiresInSeconds) =>
          val actualExpiryTime = now.plusSeconds(expiresInSeconds)
          val safeExpiryTime = actualExpiryTime.minus(safetyMargin.toMillis)
          tokenCache.set(Some(CachedToken(accessToken.token, safeExpiryTime)))
          logger.info(
            s"Cached new mParticle access token, expires at: $safeExpiryTime (${safetyMargin.toSeconds}s safety margin)",
          )
          accessToken
        }
    }
  }

  private def getAccessToken(): Future[(MParticleAccessToken, Int)] = {
    val request = OAuthTokenRequest(
      client_id = config.clientId,
      client_secret = config.clientSecret,
      audience = config.apiUrl,
      grant_type = "client_credentials",
    )

    // OAuth token endpoint is on a different domain, so we need to use a custom HTTP client call
    import com.gu.okhttp.RichOkHttpClient
    import okhttp3._

    val body = RequestBody.create(
      MediaType.parse("application/json; charset=utf-8"),
      request.asJson.noSpaces,
    )

    val oauthRequest = new Request.Builder()
      .url(config.tokenUrl)
      .post(body)
      .build()

    httpClient(oauthRequest).flatMap { response =>
      if (response.code() == 200) {
        io.circe.parser.decode[OAuthTokenResponse](response.body().string()) match {
          case Right(tokenResponse) =>
            Future.successful((tokenResponse.access_token, tokenResponse.expires_in))
          case Left(error) =>
            val errorMsg = s"Error parsing access token response: ${error.getMessage}"
            Future.failed(new RuntimeException(errorMsg))
        }
      } else {
        val errorMsg = s"mParticle OAuth returned error: status=${response.code()} body=${response.body().string()}"
        Future.failed(new RuntimeException(errorMsg))
      }
    }
  }
}

class MParticleClient(
    val httpClient: FutureHttpClient,
    mparticleConfigProvider: MparticleConfigProvider,
)(implicit ec: ExecutionContext)
    extends WebServiceHelper[MParticleError]
    with SafeLogging {

  import MParticleClient._

  private lazy val mparticleConfig: MparticleConfig = mparticleConfigProvider.get()
  private lazy val authClient = new MParticleAuthClient(httpClient, mparticleConfig)

  override val wsUrl: String = mparticleConfig.apiUrl
  override val verboseLogging: Boolean = false

  def getUserProfile(identityId: String): Future[MParticleUserProfile] = for {
    accessToken <- authClient.getCachedAccessToken()
    response <- callProfileAPI(identityId, accessToken)
  } yield parseUserProfile(response)

  def isAudienceMember(identityId: String, audienceId: Int): Future[Boolean] = for {
    accessToken <- authClient.getCachedAccessToken()
    response <- callProfileAPI(identityId, accessToken)
  } yield response.audience_memberships.exists(_.audience_id == audienceId)

  private def callProfileAPI(identityId: String, accessToken: MParticleAccessToken): Future[ProfileResponse] = {
    val fields = "audience_memberships"
    val endpoint =
      s"userprofile/v1/resolve/${mparticleConfig.orgId}/${mparticleConfig.accountId}/${mparticleConfig.workspaceId}"

    val request = ProfileRequest(
      environment_type = mparticleConfig.apiEnv,
      identity = Identity(`type` = "customer_id", value = identityId),
    )

    postJson[ProfileResponse](
      endpoint = endpoint,
      data = request.asJson,
      headers = Map("Authorization" -> s"Bearer ${accessToken.token}"),
      params = Map("fields" -> fields),
    )
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
  }
}
