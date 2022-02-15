package com.gu.support.promotions

import com.gu.monitoring.SafeLogger
import org.joda.time.{DateTime, Minutes}

import scala.concurrent.stm.{Ref, atomic}

case class PromotionCache(fetched: DateTime, promotions: Iterable[Promotion]) {
  def isFresh: Boolean = DateTime.now.getMillis - fetched.getMillis < PromotionCache.maxAge
}

object PromotionCache {
  val maxAge = Minutes.ONE.toStandardDuration.getMillis

  val promotionsRef = Ref[Option[PromotionCache]](None)

  def get: Option[Iterable[Promotion]] = promotionsRef.single().filter(_.isFresh).map(_.promotions)

  def set(promotions: Iterable[Promotion], fetched: DateTime = DateTime.now): Unit = atomic { implicit txn =>
    promotionsRef() = Some(PromotionCache(fetched, promotions))
  }
}
