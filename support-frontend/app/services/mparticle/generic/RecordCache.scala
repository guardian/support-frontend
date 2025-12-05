package services.mparticle.generic

import org.joda.time.DateTime
import services.mparticle.generic.RecordCache.Versioned

import scala.concurrent.{ExecutionContext, Future}

object RecordCache {

  case class Versioned[RECORD](record: RECORD, version: Int)

  case class RecordWithExpiry[A](value: A, expiresAt: DateTime)

  /** This creates a new cache that expires TokenWithExpiry records based on their expiresAt.
    *
    * @param tokenFetcher
    * @param ec
    * @tparam A
    * @return
    */
  def withExpiry[A](tokenFetcher: TokenFetcher[RecordWithExpiry[A]])(implicit
      ec: ExecutionContext,
  ): RecordCache[A] = {
    val recordCacheWithoutDateExpiry = new AtomicVersionedRecordCache(tokenFetcher)
    val recordCacheWithDateExpiry = recordCacheWithoutDateExpiry.filter(_.expiresAt.isAfter(DateTime.now()))
    recordCacheWithDateExpiry.map(_.value)
  }

}

/** This trait allows you to access records together with their version from the cache.
  *
  * @tparam RECORD
  */
trait RecordCache[RECORD] {

  /** Gets the current version from the cache, assuming it doesn't match any invalid version passed in and passes any
    * filters.
    *
    * @param maybeInvalidVersion
    *   a possible version to ignore if present
    * @return
    */
  def get(maybeInvalidVersion: Option[Int]): Future[Versioned[RECORD]]

  /** This adds further criteria to make it only return valid records. For example you can make it only return records
    * if their expiry is in the future.
    *
    * @param isValid
    * @param ec
    * @return
    */
  def filter(isValid: RECORD => Boolean)(implicit
      ec: ExecutionContext,
  ): RecordCache[RECORD] = new RecordCache[RECORD] {
    override def get(maybeInvalidVersion: Option[Int]): Future[Versioned[RECORD]] =
      for {
        currentVersion <- RecordCache.this.get(maybeInvalidVersion)
        validVersion <-
          if (isValid(currentVersion.record))
            Future.successful(currentVersion)
          else
            RecordCache.this.get(Some(currentVersion.version))
      } yield validVersion
  }

  def map[B](f: RECORD => B)(implicit
      ec: ExecutionContext,
  ): RecordCache[B] = new RecordCache[B] {
    override def get(maybeInvalidVersion: Option[Int]): Future[Versioned[B]] =
      RecordCache.this.get(maybeInvalidVersion).map { case Versioned(record, version) => Versioned(f(record), version) }
  }

}

trait TokenFetcher[A] {
  def fetchToken(): Future[A]
}
