package services.mparticle.generic

import com.gu.monitoring.SafeLogging
import services.mparticle.generic.AtomicVersionedRecordCache.CacheValue
import services.mparticle.generic.RecordCache.Versioned

import scala.concurrent.{ExecutionContext, Future, Promise}

object AtomicVersionedRecordCache {
  type CacheValue[RECORD] = Option[Versioned[Future[RECORD]]]
}

/** This class represents a cache which manages fetching of a record a minimal number of times.
  *
  * A version number is returned with each record.
  *
  * The record will be refetched once if the current version number is passed in.
  *
  * @param fetchFreshRecord
  * @param recordIsValid
  * @tparam RECORD
  */
class AtomicVersionedRecordCache[RECORD](
    fetchFreshRecord: TokenFetcher[RECORD],
    cache: MaybeUpdateAndGet[CacheValue[RECORD]] =
      MaybeUpdateAndGet[CacheValue[RECORD]](AtomicUpdateAndGet[CacheValue[RECORD]](None)),
)(implicit
    ec: ExecutionContext,
) extends SafeLogging
    with RecordCache[RECORD] {

  /** This function returns a record that is not the version passed in, calling fetchFreshRecord if necessary.
    *
    * We need to sequence it to get the Future on the outside, otherwise it's impossible to implement filter (above).
    *
    * @param excludeVersion
    * @param ec
    * @return
    *   a future with a version inside
    */
  override def get(excludeVersion: Option[Int]): Future[Versioned[RECORD]] =
    sequence(atomicStoreNewFetchIfCurrentVersionIsInvalid(excludeVersion))

  private def atomicStoreNewFetchIfCurrentVersionIsInvalid(excludeVersion: Option[Int]): Versioned[Future[RECORD]] = {
    val promise = Promise[RECORD]()
    val versionedEventualRecord: Versioned[Future[RECORD]] =
      atomicStorePromiseIfCurrentVersionIsInvalid(excludeVersion, promise)
    if (versionedEventualRecord.record == promise.future) {
      // we won - so start the call
      promise.completeWith(fetchFreshRecord.fetchToken())
    }
    versionedEventualRecord
  }

  private def atomicStorePromiseIfCurrentVersionIsInvalid(
      excludeVersion: Option[Int],
      promise: Promise[RECORD],
  ): Versioned[Future[RECORD]] =
    cache.maybeUpdateAndGet { maybeCurrent =>
      val maybeCurrentVersion = maybeCurrent.map(_.version)
      val versionIsInvalid = maybeCurrentVersion.forall(currentVersion => excludeVersion.contains(currentVersion))
      if (versionIsInvalid)
        Some(Some(Versioned(promise.future, maybeCurrentVersion.map(_ + 1).getOrElse(1))))
      else
        None
    }.get

  private def sequence(versionedEventualRecord: Versioned[Future[RECORD]]): Future[Versioned[RECORD]] =
    for {
      recordToUse <- versionedEventualRecord.record
    } yield Versioned(recordToUse, versionedEventualRecord.version)

}
