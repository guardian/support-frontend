package com.gu.support.config

import com.typesafe.config.ConfigFactory
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionsConfigSpec extends AsyncFlatSpec with Matchers {
  "PromotionsTablesConfigProvider" should "load successfully" in {
    val devConfig = new PromotionsConfigProvider(ConfigFactory.load(), Stages.DEV).get()
    devConfig.tables.promotions shouldBe "MembershipSub-Promotions-DEV"
    devConfig.discount.productRatePlanChargeId shouldBe "2c92c0f952f30dc30152f92b2ee62707"

    val prodConfig = new PromotionsConfigProvider(ConfigFactory.load(), Stages.PROD).get()
    prodConfig.tables.promotions shouldBe "MembershipSub-Promotions-PROD"
    prodConfig.discount.productRatePlanChargeId shouldBe "2c92a0fd5345efa10153559e97bb76c6"
  }
}
