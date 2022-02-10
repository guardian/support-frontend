package com.gu.support.promotions

import com.gu.support.config.{PromotionsConfig, PromotionsConfigProvider}
import com.gu.support.touchpoint.TouchpointServiceProvider

class PromotionServiceProvider(configProvider: PromotionsConfigProvider)
    extends TouchpointServiceProvider[PromotionService, PromotionsConfig](configProvider) {
  override protected def createService(config: PromotionsConfig) = {
    new PromotionService(config)
  }
}
