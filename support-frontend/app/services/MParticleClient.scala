package services

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import org.joda.time.DateTime
import services.MParticleClient.TokenCacheRecord

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

case class MParticleUserProfile(
    hasMobileAppDownloaded: Boolean,
    hasFeastMobileAppDownloaded: Boolean,
)

case class MParticleAccessToken(tokenAsString: String) extends AnyVal

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
  case class TokenCacheRecord(token: MParticleAccessToken, expiresAt: DateTime)

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
    extends SafeLogging
    with TokenFetcher[TokenCacheRecord, MParticleAccessToken] {

  import MParticleClient._

  private val safetyMargin = 2.minutes

  override def extractTokenFromCacheRecord(record: TokenCacheRecord): MParticleAccessToken =
    record.token

  override def isCacheRecordValid(record: TokenCacheRecord): Boolean =
    record.expiresAt.isAfter(DateTime.now())

  override def fetchNewCacheRecord(): Future[TokenCacheRecord] =
    getAccessToken().map { case (accessToken: MParticleAccessToken, expiresInSeconds: Int) =>
      val now = DateTime.now()
      val actualExpiryTime = now.plusSeconds(expiresInSeconds)
      val safeExpiryTime = actualExpiryTime.minus(safetyMargin.toMillis)
      TokenCacheRecord(accessToken, safeExpiryTime)
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

  private lazy val validAuthTokenProvider: ValidAuthTokenProvider[MParticleAccessToken] = {
    val authClient = new MParticleAuthClient(httpClient, mparticleConfig)
    ValidAuthTokenProvider(authClient)
  }

  override val wsUrl: String = mparticleConfig.apiUrl
  override val verboseLogging: Boolean = false

  def getUserProfile(identityId: String): Future[MParticleUserProfile] = {
    val fields = "audience_memberships"
    val endpoint =
      s"userprofile/v1/resolve/${mparticleConfig.orgId}/${mparticleConfig.accountId}/${mparticleConfig.workspaceId}"

    val request = ProfileRequest(
      environment_type = mparticleConfig.apiEnv,
      identity = Identity(`type` = "customer_id", value = identityId),
    )

    val eventualResponse = validAuthTokenProvider.withToken { token =>
      postJson[ProfileResponse](
        endpoint = endpoint,
        data = request.asJson,
        headers = Map("Authorization" -> s"Bearer ${token.tokenAsString}"),
        params = Map("fields" -> fields),
      )
    }

    eventualResponse.map(parseUserProfile)
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
  }
}
