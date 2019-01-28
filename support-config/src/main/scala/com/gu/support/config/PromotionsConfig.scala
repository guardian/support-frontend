package com.gu.support.config

import com.gu.support.catalog.{ProductRatePlanChargeId, ProductRatePlanId}
import com.typesafe.config.Config

case class PromotionsConfig(discount: PromotionsDiscountConfig, tables: PromotionsTablesConfig) extends TouchpointConfig

case class PromotionsTablesConfig(promotions: String, campaigns: String)

case class PromotionsDiscountConfig(productRatePlanId: ProductRatePlanId, productRatePlanChargeId: ProductRatePlanChargeId)

class PromotionsConfigProvider(config: Config, defaultStage: Stage)
  extends TouchpointConfigProvider[PromotionsConfig](config, defaultStage) {
  override protected def fromConfig(config: Config) = PromotionsConfig.fromConfig(config)
}

object PromotionsConfig {
  def fromConfig(config: Config) =
    PromotionsConfig(
      PromotionsDiscountConfig(
        config.getString("promotions.discount.productRatePlanId"),
        config.getString("promotions.discount.productRatePlanChargeId")
      ),
      PromotionsTablesConfig(
        config.getString("promotions.tables.promotions"),
        config.getString("promotions.tables.campaigns")
      )
    )
}
