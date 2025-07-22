package com.gu.support.productcatalog

import com.gu.aws.AwsS3Client
import com.gu.aws.AwsS3Client.S3Location
import com.gu.support.catalog.AwsS3ClientJson.fetchJson
import com.gu.support.config.TouchPointEnvironment
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json

import scala.util.Try

trait ProductCatalogJsonProvider {
  def get: Try[Json]
}

class S3ProductCatalogProvider(environment: TouchPointEnvironment) extends ProductCatalogJsonProvider with LazyLogging {
  override def get: Try[Json] = {
    val catalog = S3Location("gu-product-catalog", s"$environment/product-catalog.json")
    logger.info(s"Attempting to load product catalog from $catalog")
    fetchJson(AwsS3Client, catalog)
  }
}
