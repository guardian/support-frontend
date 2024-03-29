package com.gu.support.catalog

import com.gu.aws.AwsS3Client
import com.gu.aws.AwsS3Client.S3Location
import com.gu.support.catalog.AwsS3ClientJson.fetchJson
import com.gu.support.config.TouchPointEnvironment
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json

import scala.util.Try

trait CatalogJsonProvider {
  def get: Try[Json]
}

class S3CatalogProvider(environment: TouchPointEnvironment) extends CatalogJsonProvider with LazyLogging {
  override def get: Try[Json] = {
    val catalog = S3Location("gu-zuora-catalog", s"PROD/Zuora-$environment/catalog.json")
    logger.info(s"Attempting to load catalog from $catalog")
    fetchJson(AwsS3Client, catalog)
  }
}
