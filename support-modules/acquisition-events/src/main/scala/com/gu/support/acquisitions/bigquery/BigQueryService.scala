package com.gu.support.acquisitions

import cats.data.EitherT
import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQueryException, BigQueryOptions, InsertAllRequest, TableId}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.support.acquisitions.AcquisitionEventTable.{datasetName, tableName}
import com.gu.support.acquisitions.models.AcquisitionDataRow

import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future, blocking}
import com.gu.support.acquisitions.utils.Retry

class BigQueryService(config: BigQueryConfig) {
  lazy val bigQuery =
    BigQueryOptions
      .newBuilder()
      .setProjectId(config.projectId)
      .setCredentials(
        ServiceAccountCredentials.fromPkcs8(
          config.clientId,
          config.clientEmail,
          config.privateKey,
          config.privateKeyId,
          Nil.asJavaCollection,
        ),
      )
      .build()
      .getService

  def tableInsertRow(acquisitionDataRow: AcquisitionDataRow)(implicit
      executionContext: ExecutionContext,
  ): EitherT[Future, String, Unit] =
    EitherT(
      Future(
        blocking(
          // The BigQuery sdk isn't asynchronous so wrap it in a blocking future as documented here:
          // https://docs.scala-lang.org/overviews/core/futures.html#blocking-inside-a-future
          blockingInsert(acquisitionDataRow),
        ),
      ),
    )

  def tableInsertRowWithRetry(acquisitionDataRow: AcquisitionDataRow, maxRetries: Int)(implicit
      executionContext: ExecutionContext,
  ): EitherT[Future, List[String], Unit] = Retry(maxRetries)(tableInsertRow(acquisitionDataRow))

  private def blockingInsert(acquisitionDataRow: AcquisitionDataRow): Either[String, Unit] =
    try {
      val tableId = TableId.of(datasetName, tableName)
      val rowContent = AcquisitionDataRowMapper.mapToTableRow(acquisitionDataRow)
      val insertRequest = InsertAllRequest.newBuilder(tableId).addRow(rowContent).build

      val response = bigQuery.insertAll(insertRequest)

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
