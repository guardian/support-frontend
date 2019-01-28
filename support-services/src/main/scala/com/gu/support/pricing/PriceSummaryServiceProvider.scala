package com.gu.support.pricing

import com.gu.support.catalog.CatalogService
import com.gu.support.config.{PromotionsConfig, PromotionsConfigProvider}
import com.gu.support.promotions.PromotionService
import com.gu.support.touchpoint.TouchpointServiceProvider
import com.gu.support.workers.{Stage, TouchPointEnvironment}

class PriceSummaryServiceProvider(configProvider: PromotionsConfigProvider, catalogEnvironment: TouchPointEnvironment)
  extends TouchpointServiceProvider[PriceSummaryService, PromotionsConfig](configProvider){
  override protected def createService(config: PromotionsConfig): PriceSummaryService = {
    val promotionService = new PromotionService(config)
    val catalogService = CatalogService(catalogEnvironment)
    new PriceSummaryService(promotionService, catalogService)
  }
}
