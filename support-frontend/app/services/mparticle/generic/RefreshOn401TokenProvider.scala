package services.mparticle.generic

import com.gu.monitoring.SafeLogging
import com.gu.rest.{CodeBody, WebServiceClientError}

import scala.concurrent.{ExecutionContext, Future}

/** This implements a class that gets an auth token and passes it to the function.
  *
  * If there is a 401 error thrown, it retries with a new token version.
  *
  * @param tokenCache
  * @param ec
  * @tparam TOKEN
  */
class RefreshOn401TokenProvider[TOKEN](
    tokenCache: RecordCache[TOKEN],
)(implicit ec: ExecutionContext)
    extends SafeLogging {

  def withToken[RESULT](getResponse: TOKEN => Future[RESULT]): Future[RESULT] = {

    def withToken0(maybeInvalidVersion: Option[Int]): Future[RESULT] =
      for {
        versionedRecord <- tokenCache.get(maybeInvalidVersion)
        versionedResult = getResponse(versionedRecord.record)
        noMoreRetries = maybeInvalidVersion.nonEmpty
        result <-
          if (noMoreRetries)
            versionedResult // no second retry allowed
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
