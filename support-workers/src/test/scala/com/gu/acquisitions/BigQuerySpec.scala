package com.gu.acquisitions

import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQueryOptions, QueryJobConfiguration}
import com.gu.config.Configuration
import com.gu.salesforce.Salesforce.{Authentication, DeliveryContact, NewContact, SalesforceContactResponse}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.collection.JavaConverters._

@IntegrationTest
class BigQuerySpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "BigQuery" should "be able to run a query" in {
    val config = Configuration.load().bigQueryConfigProvider.get()
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

    val query = "select * from datalake.zuora_subscription where created_date = TIMESTAMP(\"2020-12-13 00:00:00\") and gift_notification_email_date is not null;"
    val queryConfig = QueryJobConfiguration.newBuilder(query).build

    val tableResult = bigQuery.query(queryConfig)
    for (row <- tableResult.iterateAll.asScala) {
      for (value <- row.asScala) {
        System.out.printf("%s,", value.toString)
      }
      System.out.printf("\n")
    }
    tableResult.getTotalRows should be > 0L
  }

}
