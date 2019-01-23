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
  def apply(stage: Stage): CatalogService = new CatalogService(stage)
}

class CatalogService(stage: Stage) extends LazyLogging {
  private lazy val catalog = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    fetchJson(s3, catalog).flatMap { c =>
      val attempt = c.as[Catalog]
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

  def getPrices[T <: Product](product: T): Map[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, List[Price]]]] = {

    val grouped = product.ratePlans.groupBy(p => (p.fulfilmentOptions, p.productOptions, p.billingPeriod)).map {
      case (keys, list) =>
        val prices = list.flatMap(p => getPriceList(p).map(_.prices))
        (keys, prices.flatten)
    }

    nestPriceLists(grouped)
  }

  private def nestPriceLists(groupedPriceList: Map[(FulfilmentOptions, ProductOptions, BillingPeriod), List[Price]]) =
    groupedPriceList
      .foldLeft(Map.empty[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, List[Price]]]]) {
        case (acc, ((fulfilment, productOptions, billing), list)) =>

          val existingProducts = acc.getOrElse(fulfilment, Map.empty[ProductOptions, Map[BillingPeriod, List[Price]]])
          val existingBillingPeriods = existingProducts.getOrElse(productOptions, Map.empty[BillingPeriod, List[Price]])

          val newBillingPeriods = existingBillingPeriods ++ Map(billing -> list)
          val newProducts = existingProducts ++ Map(productOptions -> newBillingPeriods)

          acc ++ Map(fulfilment -> newProducts)
      }

  private def getPriceList[T <: Product](productRatePlan: ProductRatePlan[T]): Option[Pricelist] =
    catalog.flatMap(_.prices.find(_.productRatePlanId == productRatePlan.id))

}
