package models.Catalog

case class Pricing(
    currency: String,
    price: Double
)

case class Charge(
    model: String,
    endDateCondition: Option[String],
    pricing: List[Pricing]
)

case class ProductRatePlan(
    name: String,
    id: String,
    productRatePlanCharges: List[Charge]
) {
  def price: Double = {
    productRatePlanCharges
      .filter(_.endDateCondition.contains("Subscription_End"))
      .map(
        _.pricing
          .filter(_.currency == "GBP")
          .map(_.price).sum
      ).sum
  }
}

case class Product(
    productRatePlans: List[ProductRatePlan]
)

case class Catalog(
    products: List[Product]
)

case class PricePlan(
    id: String,
    name: String,
    pricePerPeriod: List[Pricing]
)

object PricePlan {
  def build(catalog: Catalog, plans: List[String]): List[PricePlan] = {
    catalog.products
      .flatMap(product =>
        product.productRatePlans
          .filter(plan => {
            plans.contains(plan.id)
          }).map(productRatePlan =>
            PricePlan(
              productRatePlan.id,
              productRatePlan.name,
              List(
                Pricing(
                  "GBP",
                  productRatePlan.price
                )
              )
            )))
      .sortBy(_.pricePerPeriod.head.price)
      .reverse
  }
}

case class PaperPrices(
    collection: List[PricePlan],
    delivery: List[PricePlan]
)
object PaperPrices {
  def empty: PaperPrices = PaperPrices(List.empty, List.empty)
}
