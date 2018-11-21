package models.ZuoraCatalog

case class ZuoraCatalogPricing(
    currency: String,
    price: Double
)

case class ZuoraCatalogCharge(
    endDateCondition: Option[String],
    pricing: List[ZuoraCatalogPricing]
)

case class ZuoraCatalogProductRatePlan(
    name: Option[String],
    id: String,
    productRatePlanCharges: List[ZuoraCatalogCharge]
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

case class ZuoraCatalogProduct(
    productRatePlans: List[ZuoraCatalogProductRatePlan]
)

case class ZuoraCatalog(
    products: List[ZuoraCatalogProduct]
)

case class ZuoraCatalogPricePlan(
    id: String,
    name: Option[String],
    pricePerPeriod: List[ZuoraCatalogPricing]
)

object ZuoraCatalogPricePlan {
  def build(ZuoraCatalog: ZuoraCatalog, plans: List[String]): List[ZuoraCatalogPricePlan] = {
    ZuoraCatalog.products
      .flatMap(product =>
        product.productRatePlans
          .filter(plan => {
            plans.contains(plan.id)
          }).map(productRatePlan =>
            ZuoraCatalogPricePlan(
              productRatePlan.id,
              productRatePlan.name,
              List(
                ZuoraCatalogPricing(
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
    collection: List[ZuoraCatalogPricePlan],
    delivery: List[ZuoraCatalogPricePlan]
)
object PaperPrices {
  def empty: PaperPrices = PaperPrices(List.empty, List.empty)
}
