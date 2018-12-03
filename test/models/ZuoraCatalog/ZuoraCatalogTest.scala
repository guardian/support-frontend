package models.ZuoraCatalog

import org.scalatest.{MustMatchers, WordSpec}

class ZuoraCatalogTest extends WordSpec with MustMatchers {
  val testingCatalog = ZuoraCatalog(
    List(
      ZuoraCatalogProduct(
        productRatePlans = List(
          ZuoraCatalogProductRatePlan(
            name = Some("£15 Product"),
            id = "t-15",
            productRatePlanCharges = List(
              ZuoraCatalogCharge(
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  ZuoraCatalogPricing(
                    currency = "GBP",
                    price = 10
                  )
                )
              ),
              ZuoraCatalogCharge(
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  ZuoraCatalogPricing(
                    currency = "GBP",
                    price = 5
                  ),
                  ZuoraCatalogPricing(
                    currency = "USD",
                    price = 3
                  )
                )
              )
            )
          )
        )
      ),
      ZuoraCatalogProduct(
        productRatePlans = List(
          ZuoraCatalogProductRatePlan(
            name = Some("£20 Product"),
            id = "t-20",
            productRatePlanCharges = List(
              ZuoraCatalogCharge(
                endDateCondition = Some("Fixed_Period"),
                pricing = List(
                  ZuoraCatalogPricing(
                    currency = "GBP",
                    price = 1000
                  )
                )
              ),
              ZuoraCatalogCharge(
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  ZuoraCatalogPricing(
                    currency = "GBP",
                    price = 20
                  ),
                )
              )
            )
          )
        )
      )
    )
  )

  "PricePlan builder" should {

    "filter out USD prices" in {
      val list = ZuoraCatalogPricePlan.build(testingCatalog, List("t-15"))
      list.head.pricePerPeriod.head.currency mustBe "GBP"
      list.head.pricePerPeriod.head.price mustBe 15
    }

    "filter out a fixed period payment" in {
      val list = ZuoraCatalogPricePlan.build(testingCatalog, List("t-20"))
      list.head.pricePerPeriod.head.price mustBe 20
    }

    "returns 1 price in pounds" in {
      val list = ZuoraCatalogPricePlan.build(testingCatalog, List("t-15"))
      list.head.pricePerPeriod.length mustBe 1
      list.head.pricePerPeriod.head.currency mustBe "GBP"
    }

    "not get any products" in {
      val list = ZuoraCatalogPricePlan.build(testingCatalog, List("t-9999"))
      list.length mustBe 0
    }
  }

}
