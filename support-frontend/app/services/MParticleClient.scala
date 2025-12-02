package services

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.{CodeBody, WebServiceClientError, WebServiceHelper}
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import org.joda.time.DateTime

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future, Promise}

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
  case class VersionedToken(token: MParticleAccessToken, version: Int)

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

  private case class CachedToken(token: MParticleAccessToken, expiresAt: DateTime)

  /** Sometimes the token becomes invalid unexpectedly, and mparticle returns 401s for that token. When this happens we
    * need to refresh the token immediately. We version each token so that we can keep track of which token has become
    * invalid. This is necessary to prevent multiple token refreshes when we have concurrent requests using the invalid
    * token.
    */
  private case class VersionedFutureToken(cachedToken: Future[CachedToken], version: Int)
  private val tokenCache = new AtomicReference[VersionedFutureToken](getVersionedCachedToken(1))
  private val safetyMargin = 2.minutes

  // format: off
  /**
    * Returns the cached token and its version. Optionally takes an existing invalid version number. This is provided if
    * mparticle has returned a 401, indicating that that token is no longer valid.
    *
    * This function will attempt to refresh the token if either:
    *   1. the token has expired (based on its expires_in value)
    *   2. the current version matches the provided maybeInvalidVersion
    */
  // format: on
  def getCachedAccessToken(maybeInvalidVersion: Option[Int] = None): Future[VersionedToken] = {
    val now = DateTime.now()

    val VersionedFutureToken(futureCachedToken, version) = tokenCache.get()
    futureCachedToken.flatMap { cachedToken =>
      val isFresh = cachedToken.expiresAt.isAfter(now)
      val isValidVersion = !maybeInvalidVersion.contains(version)
      if (isValidVersion && isFresh) {
        // We can use the existing cached token
        Future.successful(VersionedToken(cachedToken.token, version))
      } else {
        // We cannot use the existing cached token, attempt a refresh
        tokenCache.updateAndGet { latest =>
          // Ensure another thread hasn't already triggered a refresh by checking the version hasn't changed
          if (version == latest.version) {
            getVersionedCachedToken(version + 1)
          } else {
            // version has since updated, no need to refresh
            latest
          }
        } match {
          case VersionedFutureToken(futureToken, version) =>
            futureToken.map(cachedToken => VersionedToken(cachedToken.token, version))
        }
      }
    }
  }

  private def getVersionedCachedToken(version: Int): VersionedFutureToken = {
    val future = getAccessToken().map { case (accessToken, expiresInSeconds) =>
      val now = DateTime.now()
      val actualExpiryTime = now.plusSeconds(expiresInSeconds)
      val safeExpiryTime = actualExpiryTime.minus(safetyMargin.toMillis)
      CachedToken(accessToken, safeExpiryTime)
    }
    VersionedFutureToken(future, version)
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

  private def callProfileAPI(identityId: String, accessToken: VersionedToken): Future[ProfileResponse] = {
    val fields = "audience_memberships"
    val endpoint =
      s"userprofile/v1/resolve/${mparticleConfig.orgId}/${mparticleConfig.accountId}/${mparticleConfig.workspaceId}"

    val request = ProfileRequest(
      environment_type = mparticleConfig.apiEnv,
      identity = Identity(`type` = "customer_id", value = identityId),
    )

    def post() = postJson[ProfileResponse](
      endpoint = endpoint,
      data = request.asJson,
      headers = Map("Authorization" -> s"Bearer ${accessToken.token.token}"),
      params = Map("fields" -> fields),
    )

    post().recoverWith { case WebServiceClientError(CodeBody("401", _)) =>
      // Unauthorized - refresh the bearer token now instead of waiting for next refresh, and try again
      logger.info("Received 401 from mParticle, invalidating token and retrying")
      for {
        _ <- authClient.getCachedAccessToken(Some(accessToken.version))
        response <- post()
      } yield response
    }
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
  }
}
