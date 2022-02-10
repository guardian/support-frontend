package com.gu.support.promotions

import com.gu.support.config.PromotionsTablesConfig
import com.gu.support.promotions.dynamo.{DynamoService, DynamoTables}

trait PromotionCollection {
  def all: Iterator[Promotion]
}

class SimplePromotionCollection(promotions: List[Promotion]) extends PromotionCollection {
  override def all: Iterator[Promotion] = promotions.iterator
}

class DynamoPromotionCollection(config: PromotionsTablesConfig)
    extends DynamoService[Promotion](DynamoTables.getTable(config.promotions))
    with PromotionCollection

class CachedDynamoPromotionCollection(config: PromotionsTablesConfig)
    extends DynamoPromotionCollection(config)
    with PromotionCollection {

  override def all: Iterator[Promotion] = PromotionCache.get.getOrElse(fetchAndCache).toIterator

  private def fetchAndCache = {
    val promotions = super.all.toList
    PromotionCache.set(promotions)
    promotions
  }
}
