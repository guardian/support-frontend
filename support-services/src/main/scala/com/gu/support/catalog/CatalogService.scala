package com.gu.support.catalog

import AwsS3Client.{fetchJson, s3}
import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.i18n.Currency
import com.gu.support.config.Stage
import com.gu.support.workers.BillingPeriod
import io.circe.generic.auto._

object CatalogService {
  def apply(stage: Stage): CatalogService = new CatalogService(stage)
}

class CatalogService(stage: Stage) {
  private lazy val catalog = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    fetchJson(s3, catalog).flatMap { c =>
      val attempt = c.as[Catalog]
      attempt.toOption
    }
  }

  def getPrice[T <: Product](
    product: T,
    currency: Currency,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions[T],
    productOptions: ProductOptions[T]
  ): Option[Price] = {
    for {
      productRatePlan <- product.getProductRatePlan(product, billingPeriod, fulfilmentOptions, productOptions)
      priceList <- getPriceList(productRatePlan)
      price <- priceList.prices.find(_.currency == currency)
    } yield price
  }

  private def getPriceList[T <: Product](productRatePlan: ProductRatePlan[T]): Option[Pricelist] =
    catalog.flatMap(_.prices.find(_.productRatePlanId == productRatePlan.id))

}
