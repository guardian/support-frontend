package com.gu.support.catalog

import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.support.catalog.AwsS3Client.{fetchJson, s3}
import com.gu.support.config.Stage
import io.circe.Json

trait CatalogJsonProvider {
  def get: Option[Json]
}

class S3CatalogProvider(stage: Stage) extends CatalogJsonProvider {
  override def get = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    fetchJson(s3, catalog)
  }
}

class SimpleJsonProvider(json: Json) extends CatalogJsonProvider {
  override def get = Some(json)
}
