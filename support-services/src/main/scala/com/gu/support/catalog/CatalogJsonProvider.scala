package com.gu.support.catalog

import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.support.catalog.AwsS3Client.{fetchJson, s3}
import com.gu.support.config.Stage
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json

trait CatalogJsonProvider {
  def get: Option[Json]
}

class S3CatalogProvider(stage: Stage) extends CatalogJsonProvider with LazyLogging {
  override def get: Option[Json] = {
    val bucket = s"gu-zuora-catalog/PROD/Zuora-$stage"
    logger.info(s"Attempting to load catalog from s3://$bucket/catalog.json")
    val catalog = new GetObjectRequest(bucket, "catalog.json")
    fetchJson(s3, catalog)
  }
}

class SimpleJsonProvider(json: Json) extends CatalogJsonProvider {
  override def get: Option[Json] = Some(json)
}
