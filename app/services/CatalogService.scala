package services

import services.aws.AwsS3Client.{fetchJson, s3}
import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.support.config.{Stage, Stages}
import play.api.libs.json.{JsValue, Json}
import ai.x.play.json.Jsonx

case class Pricing(
    currency: String,
    price: Double
)

case class Charge(
    model: String,
    pricing: List[JsValue]
)

case class ProductRatePlan(
    description: String,
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

object CatalogService {

  val paperDeliveryProductRatePlanIds = List("2c92a0086619bf8901661ab545f51b21", "2c92a0fe6619b4b601661ab300222651")

  def getCatalog(stage: Stage): Option[JsValue] = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    fetchJson(s3, catalog)
  }

  def getPaperPrices: Option[JsValue] = getCatalog(Stages.PROD).map {
    implicit lazy val jsonFormat = Jsonx.formatCaseClass[Catalog]
    Json.fromJson[Catalog](_)
  }

}
