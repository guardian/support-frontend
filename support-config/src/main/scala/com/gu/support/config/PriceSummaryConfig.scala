package com.gu.support.config

import com.typesafe.config.Config

case class PriceSummaryConfig(catalogConfig: CatalogConfig, promotionsConfig: PromotionsConfig)
class PriceSummaryConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PriceSummaryConfig](config, defaultStage) {
  override protected def fromConfig(config: Config) = {
    PriceSummaryConfig(
      CatalogConfig.fromConfig(config),
      PromotionsConfig.fromConfig(config),
    )
  }
}
