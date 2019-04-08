package com.gu.support.catalog

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{catalogFailureRequest, client}
import com.gu.i18n.Currency
import com.gu.support.catalog.FulfilmentOptions._
import com.gu.support.config.{Stages, TouchPointEnvironment}
import com.gu.support.workers.BillingPeriod
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

object CatalogService {
  def apply(environment: TouchPointEnvironment): CatalogService = new CatalogService(environment, new S3CatalogProvider(environment))
}

class CatalogService(val environment: TouchPointEnvironment, jsonProvider: CatalogJsonProvider) extends LazyLogging {
  private lazy val catalog = {

    jsonProvider.get.flatMap { json =>
      val attempt = json.as[Catalog]
      attempt.fold(
        err => {
          logger.error(s"Failed to load the catalog, error was: $err")
          AwsCloudWatchMetricPut(client)(catalogFailureRequest(environment))
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
      productRatePlan <- product.getProductRatePlan(environment, billingPeriod, fulfilmentOptions, productOptions)
      priceList <- getPriceList(productRatePlan)
      price <- priceList.prices.find(_.currency == currency)
    } yield price
  }


  def getPriceList[T <: Product](productRatePlan: ProductRatePlan[T]): Option[Pricelist] =
    catalog.flatMap(_.prices.find(_.productRatePlanId == productRatePlan.id))

}
