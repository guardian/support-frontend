package services.mparticle

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.{CodeBody, WebServiceClientError}
import config.MparticleConfig
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Random, Success}

case class MParticleAccessToken(token: String) extends AnyVal
object MParticleAccessToken {
  implicit val decoder: Decoder[MParticleAccessToken] = deriveDecoder
}

case class OAuthTokenRequest(
    client_id: String,
    client_secret: String,
    audience: String,
    grant_type: String,
)

object OAuthTokenRequest {
  implicit val oauthTokenRequestEncoder: Encoder[OAuthTokenRequest] = deriveEncoder
}

case class OAuthTokenResponse(
    access_token: MParticleAccessToken,
    token_type: String,
    expires_in: Int,
)

object OAuthTokenResponse {
  implicit val oauthTokenResponseDecoder: Decoder[OAuthTokenResponse] = deriveDecoder
}

/** Maintains a pool of mparticle auth tokens. This is necessary because tokens sometimes become invalid unexpectedly,
  * causing 401s to be returned by the API. In this case we need to try the API call again with a different token, while
  * replacing the invalid token in the background.
  */
class MParticleTokenProvider(
    val httpClient: FutureHttpClient,
    config: MparticleConfig,
)(implicit ec: ExecutionContext) {
  import OAuthTokenResponse._
  import OAuthTokenRequest._

  private val tokens = new AtomicReference[Set[MParticleAccessToken]](Set.empty)

  // Fetch the first pool of tokens
  (1 to 3).foreach(_ => fetchAndStoreToken())

  // Randomly select a token
  private def getToken(): Option[MParticleAccessToken] = {
    val currentTokens = tokens.get().toVector
    if (currentTokens.nonEmpty) Some(currentTokens(Random.nextInt(currentTokens.size)))
    else None
  }

  private def fetchToken(): Future[MParticleAccessToken] = {
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
            // TODO - handle expiry
//            Future.successful((tokenResponse.access_token, tokenResponse.expires_in))
            Future.successful(tokenResponse.access_token)
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

  private def fetchAndStoreToken(): Unit = {
    fetchToken()
      .onComplete {
        case Success(token) =>
          tokens.getAndUpdate(currentTokens => {
            currentTokens.incl(token)
          })
        case Failure(exception) =>
          // TODO - log and back off?
          fetchAndStoreToken()
      }
  }

  private def purgeToken(token: MParticleAccessToken): Unit = {
    tokens.updateAndGet(currentTokens => {
      // Check the token is still in the set
      if (currentTokens.contains(token)) {
        fetchAndStoreToken() // begin fetch in the background
        currentTokens.excl(token) // remove the invalid token now
      } else {
        currentTokens
      }
    })
  }

  // Runs the given fetch function. If a 401 is returned then it retries with a different token
  def requestWithToken[T](fn: MParticleAccessToken => Future[T]): Future[T] = {
    getToken() match {
      case Some(token) =>
        fn(token).recoverWith { case WebServiceClientError(CodeBody("401", _)) =>
          purgeToken(token)
          requestWithToken(fn)
        }
      case None =>
        // TODO - log + alarm
        Future.failed(new Exception("No token available"))
    }
  }
}
