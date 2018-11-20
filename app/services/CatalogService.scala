package services

import services.aws.AwsS3Client.{fetchJson, s3}
import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.support.config.{Stage, Stages}
import codecs.CirceDecoders._

case class Pricing(
    currency: String,
    price: Double
)

case class Charge(
    model: String,
    pricing: List[Pricing]
)

case class ProductRatePlan(
    description: Option[String],
    name: String,
    id: String,
    productRatePlanCharges: List[Charge]
)

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
    catalog.products.flatMap(product =>
      product.productRatePlans.filter(plan => {
        plans.contains(plan.id)
      }).map(productRatePlan => PricePlan(
        productRatePlan.id,
        productRatePlan.name,
        productRatePlan.description,
        productRatePlan.productRatePlanCharges.map(
          _.pricing
            .filter(_.currency == "GBP")
            .map(_.price).sum
        ).sum
      )))
  }
}

object CatalogService {

  val paperDeliveryProductRatePlanIds = List(
    "2c92a0fd56fe270b0157040dd79b35da",
    "2c92a0fd56fe270b0157040e42e536ef",
    "2c92a0ff56fe33f00157040f9a537f4b",
    "2c92a0fe5af9a6b9015b0fe1ecc0116c"
  )

  def getCatalog(stage: Stage): Option[Catalog] = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    val jsonResult = fetchJson(s3, catalog)
    jsonResult match {
      case Some(json) =>
        json.as[Catalog].toOption
      case _ => None
    }
  }

  def getPaperPrices: List[PricePlan] = getCatalog(Stages.PROD).map {
    json => PricePlan.build(json, paperDeliveryProductRatePlanIds)
  }.getOrElse(List.empty)

}
