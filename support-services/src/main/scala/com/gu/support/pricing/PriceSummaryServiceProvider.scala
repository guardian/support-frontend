package com.gu.support.pricing

import com.gu.support.catalog.CatalogService
import com.gu.support.config.{PriceSummaryConfig, PriceSummaryConfigProvider}
import com.gu.support.promotions.PromotionService
import com.gu.support.touchpoint.TouchpointServiceProvider

class PriceSummaryServiceProvider(priceSummaryConfigProvider: PriceSummaryConfigProvider)
    extends TouchpointServiceProvider[PriceSummaryService, PriceSummaryConfig](priceSummaryConfigProvider) {
  override protected def createService(config: PriceSummaryConfig): PriceSummaryService = {
    val promotionService = new PromotionService(config.promotionsConfig)
    val catalogService = CatalogService(config.catalogConfig.environment)
    new PriceSummaryService(promotionService, catalogService)
  }
}
