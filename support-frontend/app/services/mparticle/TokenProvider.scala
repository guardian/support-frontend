package services.mparticle

import com.gu.monitoring.SafeLogging
import com.gu.rest.{CodeBody, WebServiceClientError}

import scala.concurrent.{ExecutionContext, Future}

trait TokenProvider[TOKEN] {
  def withToken[RESULT](getResponse: TOKEN => Future[RESULT]): Future[RESULT]
  def contramap[B](f: TOKEN => B): TokenProvider[B] =
    new TokenProvider[B] {
      override def withToken[RESULT](getResponse: B => Future[RESULT]): Future[RESULT] =
        TokenProvider.this.withToken(getResponse.compose(f))
    }
}

/** This implements a class that provides auth tokens and retries on 401 errors.
  * @tparam TOKEN
  */
class TokenProviderImpl[RECORD](
    tokenCache: VersionedCache[RECORD], /*tokenProvider: MParticleAuthClient[RECORD, TOKEN]*/
)(implicit ec: ExecutionContext)
    extends SafeLogging
    with TokenProvider[RECORD] {

  def withToken[RESULT](getResponse: RECORD => Future[RESULT]): Future[RESULT] = {

    def withToken0(maybeInvalidVersion: Option[Int]): Future[RESULT] =
      for {
        versionedRecord <- tokenCache.getUsableValue(maybeInvalidVersion)
        versionedResult = getResponse(versionedRecord.record)
        finishedRetries = maybeInvalidVersion.nonEmpty
        result <-
          if (finishedRetries)
            versionedResult
          else
            versionedResult.recoverWith { case WebServiceClientError(CodeBody("401", _)) =>
              // Unauthorized - refresh the bearer token now instead of waiting for next refresh, and try again
              logger.info("Received 401 from mParticle, invalidating token and retrying")
              withToken0(Some(versionedRecord.version))
            }
      } yield result

    withToken0(None)
  }

}

object TokenProvider {
  def apply[RECORD](tokenCache: VersionedCache[RECORD])(implicit ec: ExecutionContext): TokenProvider[RECORD] =
    new TokenProviderImpl(tokenCache)
}
