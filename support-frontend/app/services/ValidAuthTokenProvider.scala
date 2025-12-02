package services

import com.gu.monitoring.SafeLogging
import com.gu.rest.{CodeBody, WebServiceClientError}

import scala.concurrent.{ExecutionContext, Future}

trait TokenFetcher[RECORD, TOKEN] {
  def isCacheRecordValid(record: RECORD): Boolean
  def fetchNewCacheRecord(): Future[RECORD]
  def extractTokenFromCacheRecord(record: RECORD): TOKEN
}

trait ValidAuthTokenProvider[TOKEN] {
  def withToken[RESULT](getResponse: TOKEN => Future[RESULT])(implicit ec: ExecutionContext): Future[RESULT]
}

private class ValidAuthTokenProviderImpl[RECORD, TOKEN](tokenProvider: TokenFetcher[RECORD, TOKEN])
    extends ValidAuthTokenProvider[TOKEN]
    with SafeLogging {

  private val tokenCache: VersionedCache[RECORD] = new VersionedCache(tokenProvider.fetchNewCacheRecord)

  private def getToken(maybeInvalidVersion: Option[Int])(implicit ec: ExecutionContext) =
    tokenCache.getUsableValue(maybeInvalidVersion, tokenProvider.isCacheRecordValid)

  def withToken[RESULT](getResponse: TOKEN => Future[RESULT])(implicit ec: ExecutionContext): Future[RESULT] = {
    for {
      versionAndFutureToken <- getToken(None)
      accessToken <- versionAndFutureToken.eventualRecord
      token = tokenProvider.extractTokenFromCacheRecord(accessToken)
      response <- getResponse(token).recoverWith { case WebServiceClientError(CodeBody("401", _)) =>
        // Unauthorized - refresh the bearer token now instead of waiting for next refresh, and try again
        logger.info("Received 401 from mParticle, invalidating token and retrying")
        for {
          eventualToken <- getToken(Some(versionAndFutureToken.version))
          nextAccessToken <- eventualToken.eventualRecord
          nextToken = tokenProvider.extractTokenFromCacheRecord(nextAccessToken)
          response <- getResponse(nextToken)
        } yield response
      }
    } yield response
  }
}

object ValidAuthTokenProvider {
  def apply[RECORD, TOKEN](tokenProvider: TokenFetcher[RECORD, TOKEN]): ValidAuthTokenProvider[TOKEN] =
    new ValidAuthTokenProviderImpl(tokenProvider)
}
