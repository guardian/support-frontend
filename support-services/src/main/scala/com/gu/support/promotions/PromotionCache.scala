package com.gu.support.promotions

import com.gu.monitoring.SafeLogger
import org.joda.time.{DateTime, Minutes}

import scala.concurrent.stm.{Ref, atomic}

case class PromotionCacheResponse(fetched: DateTime, promotions: Iterable[Promotion]) {
  val maxAge = Minutes.ONE.toStandardDuration.getMillis
  def isFresh: Boolean = DateTime.now.getMillis - fetched.getMillis < maxAge
}

class PromotionCache {
  // this val contains the mutable cache contents
  val promotionsRef = Ref[Option[PromotionCacheResponse]](None)

  def get: Option[Iterable[Promotion]] = promotionsRef.single().filter(_.isFresh).map(_.promotions)

  def set(promotions: Iterable[Promotion], fetched: DateTime = DateTime.now): Unit = atomic { implicit txn =>
    promotionsRef() = Some(PromotionCacheResponse(fetched, promotions))
  }
}
