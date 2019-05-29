package com.gu.support.pricing

import com.gu.support.catalog.{CatalogService, GuardianWeekly}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.promotions.PromotionServiceSpec
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}

@IntegrationTest
class PriceSummaryServiceIntegrationSpec  extends FlatSpec with Matchers with LazyLogging {

  "PriceSummaryService" should "return prices" in {
    val service = new PriceSummaryService(PromotionServiceSpec.serviceWithDynamo, CatalogService(TouchPointEnvironments.SANDBOX))
    val result = service.getPrices(GuardianWeekly, Some("WJW7OAJ3A"))
    result.size shouldBe 7
  }
}
