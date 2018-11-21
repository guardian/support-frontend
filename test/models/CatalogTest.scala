package models

import models.Catalog._

class CatalogTest {
  val testingCatalog = Catalog(
    products = List(
      Product(
        productRatePlans = List(
          ProductRatePlan(
            name = "£15 Product",
            id = "t-01",
            productRatePlanCharges = List(
              Charge(
                endDateCondition = Some("Subscription_End"),
                pricing = List(
                  Pricing(
                    currency = "GBP",
                    price = 10
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}
