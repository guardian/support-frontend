package com.gu.support.catalog

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers.{Annual, BillingPeriod, Quarterly}
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import com.typesafe.scalalogging.LazyLogging

object CatalogService {
  def apply(environment: TouchPointEnvironment): CatalogService =
    new CatalogService(environment, new S3CatalogProvider(environment))
}

class CatalogService(val environment: TouchPointEnvironment, jsonProvider: CatalogJsonProvider) extends LazyLogging {

  def getProductRatePlan(
      product: Product,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions,
      productOptions: ProductOptions,
      readerType: ReaderType = Direct,
  ) =
    product.getProductRatePlan(environment, billingPeriod, fulfilmentOptions, productOptions, readerType)

  private lazy val catalog: Catalog = {

    val attempt = for {
      json <- jsonProvider.get
      decoded <- json.as[ZuoraCatalog].toTry
    } yield {
      Catalog.convert(decoded)
    }

    attempt.get
  }

  def getPriceList[T <: Product](productRatePlanId: ProductRatePlanId): Option[Pricelist] =
    catalog.prices.find(_.productRatePlanId == productRatePlanId)
}
