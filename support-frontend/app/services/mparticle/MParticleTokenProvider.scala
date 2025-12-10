package services.mparticle

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.getMParticleTokenError
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.{CodeBody, WebServiceClientError, WebServiceHelper}
import com.gu.support.config.Stage
import com.typesafe.scalalogging.StrictLogging
import config.MparticleConfig
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import org.apache.pekko.actor.ActorSystem
import org.joda.time.DateTime

import scala.concurrent.duration._
import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Random, Success}

case class MParticleAccessToken(token: String) extends AnyVal
object MParticleAccessToken {
  implicit val decoder: Decoder[MParticleAccessToken] =
    Decoder[String].map(MParticleAccessToken.apply)
}

case class Token(token: MParticleAccessToken, created: DateTime)

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
    stage: Stage,
)(implicit ec: ExecutionContext, system: ActorSystem)
    extends WebServiceHelper[MParticleError] {
  import OAuthTokenResponse._
  import OAuthTokenRequest._

  override val wsUrl: String = config.tokenUrl
  override val verboseLogging: Boolean = false
  override val requestLogging: Boolean = false

  private val desiredTokenCount = 3
  private val tokens = new AtomicReference[Set[Token]](Set.empty)

  // Fetch the first pool of tokens
  logger.info("Fetching initial batch of mparticle tokens")
  (1 to desiredTokenCount).foreach(_ => fetchAndStoreToken())

  // Every hour purge the oldest token
  system.scheduler.scheduleAtFixedRate(1.hour, 1.hour)(() => {
    val currentTokens = tokens.get().toList
    if (currentTokens.size >= desiredTokenCount) {
      currentTokens
        .sortBy(_.created)
        .headOption
        .foreach(purgeToken)
    }
  })

  // Randomly select a token
  private def getToken(): Option[Token] = {
    val currentTokens = tokens.get().toVector
    if (currentTokens.nonEmpty) Some(currentTokens(Random.nextInt(currentTokens.size)))
    else None
  }

  private def fetchToken(): Future[Token] = {
    logger.info("Fetching new mparticle oauth token")
    val request = OAuthTokenRequest(
      client_id = config.clientId,
      client_secret = config.clientSecret,
      audience = config.apiUrl,
      grant_type = "client_credentials",
    )

    postJson[OAuthTokenResponse](
      endpoint = "oauth/token",
      data = request.asJson,
    ).map(tokenResponse => {
      Token(tokenResponse.access_token, DateTime.now())
    })
  }

  private def fetchAndStoreToken(backoff: Int = 1): Unit = {
    fetchToken()
      .onComplete {
        case Success(token) =>
          tokens.getAndUpdate(currentTokens => {
            currentTokens.incl(token)
          })
        case Failure(exception) =>
          logger.error(scrub"Error fetching oauth token from mparticle", exception)
          system.scheduler.scheduleOnce(backoff.seconds)(fetchAndStoreToken(Math.min(backoff * 2, 60)))
      }
  }

  private def purgeToken(token: Token): Unit = {
    val previousTokens = tokens.getAndUpdate(currentTokens => currentTokens.excl(token))
    // Only fetch a replacement if this call actually removed the token
    if (previousTokens.contains(token)) {
      fetchAndStoreToken() // begin fetch in the background
    }
  }

  private val maxRetries = 3
  // Runs the given fetch function. If a 401 is returned then it retries with a different token
  def requestWithToken[T](fetch: MParticleAccessToken => Future[T], retries: Int = 0): Future[T] = {
    getToken() match {
      case Some(token) =>
        fetch(token.token).recoverWith { case WebServiceClientError(CodeBody("401", _)) =>
          purgeToken(token)
          if (retries < maxRetries) {
            requestWithToken(fetch, retries + 1)
          } else {
            AwsCloudWatchMetricPut(cloudwatchClient)(getMParticleTokenError(stage))
            Future.failed(new Exception(s"Max retries ($maxRetries) reached for mParticle"))
          }
        }
      case None =>
        // We currently have no tokens
        AwsCloudWatchMetricPut(cloudwatchClient)(getMParticleTokenError(stage))
        Future.failed(new Exception("No token available"))
    }
  }
}
