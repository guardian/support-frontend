package com.gu.support.promotions

import org.joda.time.{DateTime, Minutes}

import scala.concurrent.stm.{Ref, atomic}

case class PromotionCacheResponse(fetched: DateTime, promotionsByCode: Map[PromoCode, Promotion]) {
  val maxAge: Long = Minutes.ONE.toStandardDuration.getMillis
  def isFresh: Boolean = DateTime.now.getMillis - fetched.getMillis < maxAge
}

class PromotionCache {
  val promotionsRef = Ref[Option[PromotionCacheResponse]](None)

  def getMap: Option[Map[PromoCode, Promotion]] = promotionsRef.single().filter(_.isFresh).map(_.promotionsByCode)

  def set(promotions: Iterable[Promotion], fetched: DateTime = DateTime.now): Unit = atomic { implicit txn =>
    promotionsRef() = Some(PromotionCacheResponse(fetched, promotions.map(p => p.promoCode -> p).toMap))
  }
}
