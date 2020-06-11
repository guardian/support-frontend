package com.gu.support.pricing

import com.gu.i18n.CountryGroup.{UK, US}
import com.gu.support.catalog._
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.promotions.PromotionServiceSpec
import com.gu.support.workers.{Annual, Quarterly}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers


@IntegrationTest
class PriceSummaryServiceIntegrationSpec  extends AsyncFlatSpec with Matchers with LazyLogging {
  val service = new PriceSummaryService(PromotionServiceSpec.serviceWithDynamo, CatalogService(TouchPointEnvironments.SANDBOX))

  "PriceSummaryService" should "return prices" in {
    val result = service.getPrices(GuardianWeekly, List("WJW7OAJ3A"))
    result.size shouldBe 7
    result(UK)(Domestic)(NoProductOptions).size shouldBe 3
  }

  it should "return fixed term prices" in {
    val fixed = service.getPrices(GuardianWeekly, Nil, fixedTerm = true)
    fixed.size shouldBe 7
    fixed(US)(RestOfWorld)(NoProductOptions).size shouldBe 2 // Annual and three month
    fixed(US)(RestOfWorld)(NoProductOptions).find(_._1 == Annual) shouldBe defined
    fixed(US)(RestOfWorld)(NoProductOptions).find(_._1 == Quarterly) shouldBe defined
  }
}
