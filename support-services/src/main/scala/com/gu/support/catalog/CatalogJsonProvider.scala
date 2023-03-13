package com.gu.support.catalog

import com.amazonaws.services.s3.AmazonS3URI
import com.gu.aws.AwsS3Client
import com.gu.support.catalog.AwsS3ClientJson.fetchJson
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json

trait CatalogJsonProvider {
  def get: Option[Json]
}

class S3CatalogProvider(environment: TouchPointEnvironment) extends CatalogJsonProvider with LazyLogging {
  override def get: Option[Json] = {
    val bucket = s"s3://gu-zuora-catalog/PROD/Zuora-${keyFromEnvironment(environment)}"
    logger.info(s"Attempting to load catalog from $bucket/catalog.json")
    val catalog = new AmazonS3URI(bucket + "/catalog.json")
    fetchJson(AwsS3Client, catalog)
  }

  private def keyFromEnvironment(environment: TouchPointEnvironment) = environment match {
    case SANDBOX => "DEV"
    case other: TouchPointEnvironment => other.toString
  }
}

class SimpleJsonProvider(json: Json) extends CatalogJsonProvider {
  override def get: Option[Json] = Some(json)
}
