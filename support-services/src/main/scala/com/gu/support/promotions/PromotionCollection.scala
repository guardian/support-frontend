package com.gu.support.promotions

import com.gu.support.config.PromotionsTablesConfig
import com.gu.support.promotions.dynamo.DynamoService

trait PromotionCollection {
  def allByCode: Map[PromoCode, Promotion]
}

class SimplePromotionCollection(promotions: List[Promotion]) extends PromotionCollection {
  override def allByCode: Map[PromoCode, Promotion] = promotions.map(p => p.promoCode -> p).toMap
}

class DynamoPromotionCollection(config: PromotionsTablesConfig)
    extends DynamoService[Promotion](config.promotions)
    with PromotionCollection {
  override def allByCode: Map[PromoCode, Promotion] = all.map(p => p.promoCode -> p).toMap
}

class CachedDynamoPromotionCollection(config: PromotionsTablesConfig) extends DynamoPromotionCollection(config) {

  val cache = new PromotionCache
  override def allByCode: Map[PromoCode, Promotion] = cache.getMap.getOrElse(fetchAndCache)

  private def fetchAndCache: Map[PromoCode, Promotion] = {
    val promotions = super.allByCode.values
    cache.set(promotions)
    cache.getMap.get
  }
}
