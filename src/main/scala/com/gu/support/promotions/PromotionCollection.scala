package com.gu.support.promotions

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.dynamo.{DynamoService, DynamoTables}
import com.typesafe.config.Config

trait PromotionCollection {
  def all(): Iterator[AnyPromotion]
}

class SimplePromotionCollection(promotions: List[AnyPromotion]) extends PromotionCollection {
  override def all(): Iterator[AnyPromotion] = promotions.iterator
}

class DynamoPromotionCollection(config: Config, environment: TouchPointEnvironment) extends
  DynamoService[AnyPromotion](DynamoTables.promotions(config, environment)) with
  PromotionCollection

