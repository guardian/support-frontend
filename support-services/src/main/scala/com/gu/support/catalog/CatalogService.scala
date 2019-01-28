package com.gu.support.catalog

import AwsS3Client.{fetchJson, s3}
import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.i18n.Currency
import com.gu.support.config.Stage
import com.gu.support.workers.BillingPeriod
import io.circe.generic.auto._
import FulfilmentOptions._
import com.typesafe.scalalogging.LazyLogging

object CatalogService {
  def apply(stage: Stage): CatalogService = new CatalogService(new S3CatalogProvider(stage))
}

class CatalogService(jsonProvider: CatalogJsonProvider) extends LazyLogging {
  private lazy val catalog = {

    jsonProvider.get.flatMap { json =>
      val attempt = json.as[Catalog]
      attempt.fold(
        err => {
          logger.error(s"Failed to load the catalog, error was: $err")
          None
        },
        c => {
          logger.info(s"Successfully loaded the catalog")
          Some(c)
        }
      )
    }
  }

  def getPrice[T <: Product](
    product: T,
    currency: Currency,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: ProductOptions
  ): Option[Price] = {
    for {
      productRatePlan <- product.getProductRatePlan(billingPeriod, fulfilmentOptions, productOptions)
      priceList <- getPriceList(productRatePlan)
      price <- priceList.prices.find(_.currency == currency)
    } yield price
  }


  def getPriceList[T <: Product](productRatePlan: ProductRatePlan[T]): Option[Pricelist] =
    catalog.flatMap(_.prices.find(_.productRatePlanId == productRatePlan.id))

}
