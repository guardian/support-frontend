package com.gu.support.workers

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.catalog.{Domestic, Everyday, HomeDelivery, NationalDelivery}
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.paperround.AgentId
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import org.scalatest.OptionValues._
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class ProductTypeRatePlansSpec extends AsyncFlatSpec with Matchers {

  "ProductTypeRatePlans" should "return the correct product rate plan for a given product type" in {
    val weekly = GuardianWeekly(GBP, Annual, Domestic)
    weeklyRatePlan(weekly, CODE, Direct).value.description shouldBe "Guardian Weekly annual, domestic delivery"

    val paper = Paper(USD, Monthly, HomeDelivery, Everyday, Some(AgentId(0)))
    paperRatePlan(paper, CODE).value.id shouldBe "2c92c0f955c3cf0f0155c5d9e2493c43"

    val nationalDeliveryPaper =
      Paper(USD, Monthly, NationalDelivery, Everyday, Some(AgentId(8172)))
    paperRatePlan(nationalDeliveryPaper, CODE).value.id shouldBe "8ad096ca8992481d018992a363bd17ad"
  }

}
