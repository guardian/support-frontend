package services

import services.VersionedCache.Versioned

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.{ExecutionContext, Future, Promise}

object VersionedCache {

  case class Versioned[A](eventualA: Future[A], version: Int)

}

class VersionedCache[A](fetchFreshRecord: () => Future[A]) {

  private val cache: AtomicReference[Versioned[A]] = new AtomicReference[Versioned[A]](Versioned(fetchFreshRecord(), 1))

  private def getNextVersion(invalidVersion: Int): Versioned[A] = {
    val promise = Promise[A]()
    val versionedFutureToken = cache.updateAndGet { latest =>
      // Ensure another thread hasn't already triggered a refresh by checking the version hasn't changed
      if (invalidVersion != latest.version) latest // version has since updated, no need to refresh
      else Versioned(promise.future, invalidVersion + 1)
    }
    if (versionedFutureToken.eventualA == promise.future) {
      // we won - so start the call
      promise.completeWith(fetchFreshRecord())
    }
    versionedFutureToken
  }

  def getUsableValue(maybeInvalidVersion: Option[Int], isUsable: A => Boolean)(implicit
      ec: ExecutionContext,
  ): Future[Versioned[A]] = {
    // it's mutable, so get the current version once up front to work from
    val currentCacheValue = cache.get()

    maybeInvalidVersion match {
      case Some(invalidVersion) if currentCacheValue.version == invalidVersion =>
        Future.successful(getNextVersion(currentCacheValue.version))
      case _ =>
        currentCacheValue.eventualA.map { a =>
          if (isUsable(a)) currentCacheValue // We can use the existing cached token
          else getNextVersion(currentCacheValue.version)
        }
    }
  }

}
