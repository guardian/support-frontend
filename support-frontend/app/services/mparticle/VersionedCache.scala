package services.mparticle

import com.gu.monitoring.SafeLogging
import services.mparticle.VersionedCache.Versioned

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.{ExecutionContext, Future, Promise}

object VersionedCache {

  case class Versioned[RECORD](record: RECORD, version: Int)

}

/** This class represents a cache which manages fetching of a record a minimal number of times.
  *
  * The record will be refetched if either the version or the record itself is not valid.
  *
  * @param fetchFreshRecord
  * @param recordIsValid
  * @tparam RECORD
  */
class VersionedCache[RECORD](fetchFreshRecord: () => Future[RECORD], recordIsValid: RECORD => Boolean)(implicit
    ec: ExecutionContext,
) extends SafeLogging {

  private val cache: AtomicReference[Versioned[Future[RECORD]]] =
    new AtomicReference[Versioned[Future[RECORD]]](Versioned(fetchFreshRecord(), 1))

  /** This function returns a record that is not the version passed in, and passes the recordIsValid check, calling
    * fetchFreshRecord if necessary.
    *
    * @param maybeInvalidVersion
    * @param ec
    * @return
    *   a future with a version inside
    */
  def getUsableValue(maybeInvalidVersion: Option[Int]): Future[Versioned[RECORD]] = {
    // it's mutable, so get the current version once up front to work from
    val Versioned(currentEventualRecord, currentVersion) = cache.get()
    for {
      currentRecord <- currentEventualRecord
      maybeVersionNotToUse = if (!recordIsValid(currentRecord)) Some(currentVersion) else maybeInvalidVersion
      recordToUse <- sequence(getNextVersion(maybeVersionNotToUse))
    } yield recordToUse
  }

  /** This private function returns a record that is not the version passed in, calling fetchFreshRecord if necessary.
    *
    * @param maybeInvalidVersion
    * @return
    *   a version with a future inside
    */
  private def getNextVersion(maybeInvalidVersion: Option[Int]): Versioned[Future[RECORD]] = {
    val promise = Promise[RECORD]()
    val versionedEventualRecord = cache.updateAndGet { latest =>
      val versionIsInvalid = maybeInvalidVersion.contains(latest.version)
      if (versionIsInvalid)
        Versioned(promise.future, latest.version + 1)
      else
        latest
    }
    if (versionedEventualRecord.record == promise.future) {
      // we won - so start the call
      promise.completeWith(fetchFreshRecord())
    }
    versionedEventualRecord
  }

  private def sequence(versionedEventualRecord: Versioned[Future[RECORD]]): Future[Versioned[RECORD]] =
    for {
      recordToUse <- versionedEventualRecord.record
    } yield Versioned(recordToUse, versionedEventualRecord.version)

}
