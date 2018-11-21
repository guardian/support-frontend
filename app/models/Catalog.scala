package models.Catalog

case class Pricing(
    currency: String,
    price: Double
)

case class Charge(
    model: String,
    endDateCondition: String,
    pricing: List[Pricing]
)

case class ProductRatePlan(
    description: Option[String],
    name: String,
    id: String,
    productRatePlanCharges: List[Charge]
) {
  def price: Double = {
    productRatePlanCharges
      .filter( _.endDateCondition == "Subscription_End")
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
    description: Option[String],
    price: Double
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
              productRatePlan.description,
              productRatePlan.price
            )
          )
      )
      .sortBy(_.price)
      .reverse
  }
}

case class PaperPrices (
  collection: List[PricePlan],
  delivery: List[PricePlan],
)
object PaperPrices {
  def empty = PaperPrices(List.empty, List.empty)
}
