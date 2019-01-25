package com.gu.support.pricing

import com.gu.support.catalog.CatalogService
import com.gu.support.config.{PromotionsConfig, PromotionsConfigProvider, Stage}
import com.gu.support.promotions.PromotionService
import com.gu.support.touchpoint.TouchpointServiceProvider

class PriceSummaryServiceProvider(configProvider: PromotionsConfigProvider, catalogStage: Stage)
  extends TouchpointServiceProvider[PriceSummaryService, PromotionsConfig](configProvider){
  override protected def createService(config: PromotionsConfig): PriceSummaryService = {
    val promotionService = new PromotionService(config)
    val catalogService = CatalogService(catalogStage)
    new PriceSummaryService(promotionService, catalogService)
  }
}
