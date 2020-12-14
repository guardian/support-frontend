package com.gu.acquisitions

import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQueryException, BigQueryOptions, InsertAllRequest, TableId}
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

      val response = bigQuery.insertAll(insertRequest)

      if (response.hasErrors) { // If any of the insertions failed, this lets you inspect the errors
        for (entry <- response.getInsertErrors.entrySet.asScala) {
          System.out.println("Response error: \n" + entry.getValue)
        }
        Left("There were errors")
      } else {
        System.out.println("Rows successfully inserted into table")
        Right(())
      }
    } catch {
      case e: BigQueryException => System.out.println("Insert operation not performed \n" + e.toString)
        Left("Insert operation not performed \n" + e.toString)
    }
  }
}
