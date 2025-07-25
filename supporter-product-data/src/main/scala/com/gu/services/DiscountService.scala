package com.gu.services

import com.gu.supporterdata.model.Stage
import com.jayway.jsonpath.{Configuration, JsonPath}
import com.typesafe.scalalogging.LazyLogging
import net.minidev.json.JSONArray

import scala.util.Try

class DiscountService(catalogLoader: CatalogLoader) {
  def getDiscountProductRatePlanIds: Try[List[String]] = for {
    catalogString <- catalogLoader.loadCatalog
    catalogJson <- Try(Configuration.defaultConfiguration.jsonProvider.parse(catalogString))
    ids <- Try(
      JsonPath
        .read[JSONArray](catalogJson, "$.products[?(@.name == \"Discounts\")].productRatePlans[*].id")
        .toArray
        .toList
        .map(_.toString),
    )
  } yield ids
}

trait CatalogLoader { def loadCatalog: Try[String] }

class S3CatalogLoader(stage: Stage) extends CatalogLoader with LazyLogging {
  def loadCatalog: Try[String] = {
    val bucket = "gu-zuora-catalog"
    val key = s"PROD/Zuora-${stage.value}/catalog.json"
    logger.info(s"Attempting to load catalog from $bucket/$key")

    Try(
      S3Service.getAsString(bucket, key),
    )
  }
}

object DiscountService extends LazyLogging {
  def apply(stage: Stage) = new DiscountService(new S3CatalogLoader(stage))
}
