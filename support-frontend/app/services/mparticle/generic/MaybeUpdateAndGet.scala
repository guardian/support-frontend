package services.mparticle.generic

import java.util.concurrent.atomic.AtomicReference

/** This is an optimistic optimisation of updateAndGet in that it avoids setting the value to its existing value, thus
  * reducing contention.
  *
  * Without it, under high traffic, every thread that gets the value from the cache will have to loop in AtomicReference
  * unnecessarily
  */
object MaybeUpdateAndGet {

  def apply[RECORD](cache: AtomicUpdateAndGet[RECORD]): MaybeUpdateAndGet[RECORD] = {

    new MaybeUpdateAndGet[RECORD]() {
      override def maybeUpdateAndGet(f: RECORD => Option[RECORD]): RECORD = {
        val oldValue = cache.get()
        f(oldValue) match {
          case Some(_) => cache.updateAndGet(currentValue => f(currentValue).getOrElse(currentValue))
          case None => oldValue
        }
      }
    }
  }
}

trait MaybeUpdateAndGet[RECORD] {
  def maybeUpdateAndGet(f: RECORD => Option[RECORD]): RECORD
}

object AtomicUpdateAndGet {
  def apply[RECORD](init: RECORD): AtomicUpdateAndGet[RECORD] = {
    val cache = new AtomicReference[RECORD](init)
    new AtomicUpdateAndGet[RECORD]() {
      override def updateAndGet(f: RECORD => RECORD): RECORD =
        cache.updateAndGet(existingValue => f(existingValue))
      override def get(): RECORD = cache.get()
    }
  }
}

trait AtomicUpdateAndGet[RECORD] {
  def updateAndGet(f: RECORD => RECORD): RECORD
  def get(): RECORD
}
