package models.Catalog

import org.scalatest.{MustMatchers, WordSpec}

class CatalogTest extends WordSpec with MustMatchers {
  val testingCatalog = Catalog(
    List(
      Product(
        productRatePlans = List(
          ProductRatePlan(
            name = "£15 Product",
            id = "t-15",
            productRatePlanCharges = List(
              Charge(
                model = "Test",
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  Pricing(
                    currency = "GBP",
                    price = 10
                  )
                )
              ),
              Charge(
                model = "Test",
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  Pricing(
                    currency = "GBP",
                    price = 5
                  ),
                  Pricing(
                    currency = "USD",
                    price = 3
                  )
                )
              )
            )
          )
        )
      ),
      Product(
        productRatePlans = List(
          ProductRatePlan(
            name = "£20 Product",
            id = "t-20",
            productRatePlanCharges = List(
              Charge(
                model = "Test",
                endDateCondition = Some("Fixed_Period"),
                pricing = List(
                  Pricing(
                    currency = "GBP",
                    price = 1000
                  )
                )
              ),
              Charge(
                model = "Test",
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  Pricing(
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
      val list = PricePlan.build(testingCatalog, List("t-15"))
      list.head.pricePerPeriod.head.currency mustBe "GBP"
      list.head.pricePerPeriod.head.price mustBe 15
    }

    "filter out a fixed period payment" in {
      val list = PricePlan.build(testingCatalog, List("t-20"))
      list.head.pricePerPeriod.head.price mustBe 20
    }

    "returns 1 price in pounds" in {
      val list = PricePlan.build(testingCatalog, List("t-15"))
      list.head.pricePerPeriod.length mustBe 1
      list.head.pricePerPeriod.head.currency mustBe "GBP"
    }

    "not get any products" in {
      val list = PricePlan.build(testingCatalog, List("t-9999"))
      list.length mustBe 0
    }
  }

}
