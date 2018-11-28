package com.gu.support.config

import com.typesafe.config.Config

case class PromotionsTablesConfig(promotions: String, campaigns: String) extends TouchpointConfig

class PromotionsTablesConfigProvider(config: Config, defaultStage: Stage)
  extends TouchpointConfigProvider[PromotionsTablesConfig](config, defaultStage) {
  override protected def fromConfig(config: Config) =
    PromotionsTablesConfig(
      config.getString("dynamodb.promotions.tables.promotions"),
      config.getString("dynamodb.promotions.tables.campaigns")
    )
}
