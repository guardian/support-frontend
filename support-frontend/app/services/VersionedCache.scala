package services

import com.gu.monitoring.SafeLogging
import services.VersionedCache.Versioned

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.{ExecutionContext, Future, Promise}

object VersionedCache {

  case class Versioned[RECORD](eventualRecord: Future[RECORD], version: Int)

}

class VersionedCache[RECORD](fetchFreshRecord: () => Future[RECORD]) extends SafeLogging {

  private val cache: AtomicReference[Versioned[RECORD]] =
    new AtomicReference[Versioned[RECORD]](Versioned(fetchFreshRecord(), 1))

  private def getNextVersion(invalidVersion: Int): Versioned[RECORD] = {
    val promise = Promise[RECORD]()
    val versionedEventualRecord = cache.updateAndGet { latest =>
      // Ensure another thread hasn't already triggered a refresh by checking the version hasn't changed
      if (invalidVersion != latest.version) latest // version has since updated, no need to refresh
      else Versioned(promise.future, invalidVersion + 1)
    }
    if (versionedEventualRecord.eventualRecord == promise.future) {
      // we won - so start the call
      promise.completeWith(fetchFreshRecord())
    }
    versionedEventualRecord
  }

  def getUsableValue(maybeInvalidVersion: Option[Int], isUsable: RECORD => Boolean)(implicit
      ec: ExecutionContext,
  ): Future[Versioned[RECORD]] = {
    // it's mutable, so get the current version once up front to work from
    val currentCacheValue: Versioned[RECORD] = cache.get()

    maybeInvalidVersion match {
      case Some(invalidVersion) if currentCacheValue.version == invalidVersion =>
        Future.successful(getNextVersion(currentCacheValue.version))
      case _ =>
        currentCacheValue.eventualRecord
          .map { record =>
            if (isUsable(record)) currentCacheValue // We can use the existing cached token
            else getNextVersion(currentCacheValue.version)
          }
          .recover { _ =>
            // eventualRecord might have failed if e.g. the auth endpoint returned a 500 error *on a previous request*
            // (the request that originally created the cached record will have failed as the future would have been hidden inside the record)
            // but do we really want to reattempt auth every subsequent request after it fails - maybe have a lockout period?
            getNextVersion(currentCacheValue.version)
          }
    }
  }

}
