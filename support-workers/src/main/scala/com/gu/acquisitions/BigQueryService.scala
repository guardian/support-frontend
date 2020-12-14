package com.gu.acquisitions

import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQueryException, BigQueryOptions, InsertAllRequest, TableId}
import com.gu.support.config.BigQueryConfig
import com.gu.support.touchpoint.TouchpointService

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

  def tableInsertRow(datasetName: String, tableName: String, rowContent: util.Map[String, AnyRef]): Unit = {
    try {
      val tableId = TableId.of(datasetName, tableName)

      val insertRequest = InsertAllRequest.newBuilder(tableId).addRow(rowContent).build

      val response = bigQuery.insertAll(insertRequest)

      if (response.hasErrors) { // If any of the insertions failed, this lets you inspect the errors
        for (entry <- response.getInsertErrors.entrySet.asScala) {
          System.out.println("Response error: \n" + entry.getValue)
        }
      }
      System.out.println("Rows successfully inserted into table")
    } catch {
      case e: BigQueryException =>
        System.out.println("Insert operation not performed \n" + e.toString)
    }
  }
}
