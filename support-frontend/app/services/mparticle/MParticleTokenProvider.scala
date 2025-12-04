package services.mparticle

import com.gu.okhttp.RequestRunners.FutureHttpClient
import config.MparticleConfig
import org.joda.time.DateTime

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

object MParticleTokenProvider {

  case class TokenCacheRecord(token: MParticleAccessToken, expiresAt: DateTime)

  def apply(httpClient: FutureHttpClient, config: MparticleConfig)(implicit
      ec: ExecutionContext,
  ): TokenProvider[MParticleAccessToken] = {
    val authClient = new MParticleAuthClient(httpClient, config)
    val cache = new VersionedCache(fetchNewCacheRecord(authClient), isCacheRecordValid)
    TokenProvider(cache).contramap(_.token)
  }

  private def isCacheRecordValid(record: TokenCacheRecord): Boolean =
    record.expiresAt.isAfter(DateTime.now())

  private def fetchNewCacheRecord(mparticleAuthClient: MParticleAuthClient)()(implicit
      ec: ExecutionContext,
  ): Future[TokenCacheRecord] =
    mparticleAuthClient.getAccessToken().map { case (accessToken: MParticleAccessToken, expiresInSeconds: Int) =>
      val now = DateTime.now()
      val actualExpiryTime = now.plusSeconds(expiresInSeconds)
      val safeExpiryTime = actualExpiryTime.minus(safetyMargin.toMillis)
      TokenCacheRecord(accessToken, safeExpiryTime)
    }

  private val safetyMargin = 2.minutes

}
