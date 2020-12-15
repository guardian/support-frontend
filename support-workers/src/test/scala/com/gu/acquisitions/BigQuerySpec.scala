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
  lazy val config = Configuration.load().bigQueryConfigProvider.get()
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

  "BigQuery" should "be able to run a query" in {
    val query = s"""select * from ${BigQuerySchema.datasetName}.${BigQuerySchema.tableName} where amount = 9999 and event_timestamp > TIMESTAMP("2020-12-14 00:20:00");"""
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

  it should "be able to run an insert" in {
    val service = new BigQueryService(config)

    val row = Map(
      "event_timestamp" -> "2020-12-14 01:00:00",
      "product" -> "RECURRING_CONTRIBUTION",
      "amount" -> 9999,
      "payment_frequency" -> "MONTHLY",
      "country_code" -> "GB",
      "currency" -> "GBP",
      "payment_provider" -> "STRIPE",
      "ab_tests" -> List(
        Map(
          "name" -> "test_test",
          "variant" -> "monkey nuts"
        ).asJava,
        Map(
          "name" -> "test2",
          "variant" -> "Oy vey!"
        ).asJava).asJava,
      "query_parameters" -> List(
        Map(
          "key" -> "foo",
          "value" -> "bar"
        ).asJava).asJava
    )

    service.tableInsertRow(BigQuerySchema.datasetName, BigQuerySchema.tableName, row) shouldBe Right(())
  }

}
