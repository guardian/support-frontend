package services.mparticle

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import config.MparticleConfig
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import org.joda.time.DateTime
import services.mparticle.generic.TokenFetcher
import services.mparticle.generic.RecordCache.RecordWithExpiry

import scala.concurrent.duration.DurationInt
import scala.concurrent.{ExecutionContext, Future}

case class MParticleAccessToken(tokenAsString: String) extends AnyVal

case class OAuthTokenRequest(
    client_id: String,
    client_secret: String,
    audience: String,
    grant_type: String,
)

case class OAuthTokenResponse(
    access_token: MParticleAccessToken,
    expires_in: Int,
)

object MParticleAuthClient {

  implicit val oauthTokenRequestEncoder: Encoder[OAuthTokenRequest] = deriveEncoder
  implicit val mParticleAccessTokenDecoder: Decoder[MParticleAccessToken] =
    Decoder[String].map(MParticleAccessToken.apply)
  implicit val oauthTokenResponseDecoder: Decoder[OAuthTokenResponse] = deriveDecoder
}

class MParticleAuthClient(
    val httpClient: FutureHttpClient,
    config: MparticleConfig,
)(implicit ec: ExecutionContext)
    extends SafeLogging
    with TokenFetcher[RecordWithExpiry[MParticleAccessToken]] {

  import MParticleAuthClient._

  private val safetyMargin = 2.minutes

  override def fetchToken(): Future[RecordWithExpiry[MParticleAccessToken]] = getAccessToken().map { authResponse =>
    val now = DateTime.now()
    val actualExpiryTime = now.plusSeconds(authResponse.expires_in)
    val safeExpiryTime = actualExpiryTime.minus(safetyMargin.toMillis)
    RecordWithExpiry(authResponse.access_token, safeExpiryTime)
  }

  def getAccessToken(): Future[OAuthTokenResponse] = {
    val request = OAuthTokenRequest(
      client_id = config.clientId,
      client_secret = config.clientSecret,
      audience = config.apiUrl,
      grant_type = "client_credentials",
    )

    // OAuth token endpoint is on a different domain, so we need to use a custom HTTP client call
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
            Future.successful(tokenResponse)
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
