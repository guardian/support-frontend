package com.gu.support.productcatalog

import com.gu.support.config.TouchPointEnvironment
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.Future

object ProductCatalogService {
  def apply(environment: TouchPointEnvironment): ProductCatalogService =
    new ProductCatalogService(new S3ProductCatalogProvider(environment))
}

class ProductCatalogService(jsonProvider: ProductCatalogJsonProvider) extends LazyLogging {

  def getProductRatePlanId(
      product: String,
      ratePlan: String,
  ): Future[String] = Future.fromTry(for {
    json <- jsonProvider.get
    productRatePlanId <- json.hcursor
      .downField(product)
      .downField("ratePlans")
      .downField(ratePlan)
      .downField("id")
      .as[String]
      .toTry
  } yield {
    productRatePlanId
  })

  def getChargeId(
      product: String,
      ratePlan: String,
      charge: String,
  ): Future[String] = Future.fromTry(for {
    json <- jsonProvider.get
    productRatePlanId <- json.hcursor
      .downField(product)
      .downField("ratePlans")
      .downField(ratePlan)
      .downField("charges")
      .downField(charge)
      .downField("id")
      .as[String]
      .toTry
  } yield {
    productRatePlanId
  })
}
