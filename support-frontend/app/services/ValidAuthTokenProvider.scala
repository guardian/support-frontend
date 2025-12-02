package services

import com.gu.monitoring.SafeLogging
import com.gu.rest.{CodeBody, WebServiceClientError}

import scala.concurrent.{ExecutionContext, Future}

trait TokenFetcher[X, V] {
  def isCacheRecordValid(record: X): Boolean
  def fetchNewCacheRecord(): Future[X]
  def extractTokenFromCacheRecord(record: X): V
}

class ValidAuthTokenProvider[T, V](tokenProvider: TokenFetcher[T, V]) extends SafeLogging {

  private val tokenCache: VersionedCache[T] = new VersionedCache(tokenProvider.fetchNewCacheRecord)

  private def getToken(maybeInvalidVersion: Option[Int])(implicit ec: ExecutionContext) =
    tokenCache.getUsableValue(maybeInvalidVersion, tokenProvider.isCacheRecordValid)

  def withToken[R](getResponse: V => Future[R])(implicit ec: ExecutionContext): Future[R] = {
    for {
      versionAndFutureToken <- getToken(None)
      accessToken <- versionAndFutureToken.eventualA
      response <- getResponse(tokenProvider.extractTokenFromCacheRecord(accessToken)).recoverWith {
        case WebServiceClientError(CodeBody("401", _)) =>
          // Unauthorized - refresh the bearer token now instead of waiting for next refresh, and try again
          logger.info("Received 401 from mParticle, invalidating token and retrying")
          for {
            eventualToken <- getToken(Some(versionAndFutureToken.version))
            nextAccessToken <- eventualToken.eventualA
            response <- getResponse(tokenProvider.extractTokenFromCacheRecord(nextAccessToken))
          } yield response
      }
    } yield response
  }

}
