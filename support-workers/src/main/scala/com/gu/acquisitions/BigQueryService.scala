package com.gu.acquisitions

import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQueryException, BigQueryOptions, InsertAllRequest, TableId}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.config.BigQueryConfig
import com.gu.support.touchpoint.TouchpointService

import scala.collection.immutable.Map
import java.util
import scala.collection.JavaConverters._

class BigQueryService(config: BigQueryConfig) extends TouchpointService {
  lazy val bigQuery =
    BigQueryOptions
      .newBuilder()
      .setProjectId(config.projectId)
      .setCredentials(ServiceAccountCredentials.fromPkcs8(
        config.clientId,
        config.clientEmail,
        config.privateKey,
        config.privateKeyId,
        Nil.asJavaCollection
      ))
      .build().getService

  def tableInsertRow(datasetName: String, tableName: String, rowContent: Map[String, Any]): Either[String, Unit] = {
    try {
      val tableId = TableId.of(datasetName, tableName)

      val insertRequest = InsertAllRequest.newBuilder(tableId).addRow(rowContent.asJava).build

      val response = bigQuery.insertAll(insertRequest) // Seems there is currently no Async way to do this

      if (response.hasErrors) {
        val errors = response.getInsertErrors.entrySet.asScala.mkString(", ").stripSuffix(", ")
        SafeLogger.error(scrub"Failed to insert row into $tableName: $errors")
        Left(s"Failed to insert row into $tableName: $errors")
      } else {
        SafeLogger.info(s"Rows successfully inserted into table $tableName")
        Right(())
      }
    } catch {
      case e: BigQueryException =>
        SafeLogger.error(scrub"There was an exception inserting a row into $tableName", e)
        Left(s"There was an exception inserting a row into $tableName: ${e.getMessage}")
    }
  }
}
