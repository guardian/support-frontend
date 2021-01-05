package com.gu.acquisitions

import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQueryOptions, QueryJobConfiguration}
import com.gu.config.Configuration
import com.gu.i18n.{Country, Currency}
import com.gu.salesforce.Salesforce.{Authentication, DeliveryContact, NewContact, SalesforceContactResponse}
import com.gu.support.acquisitions.AcquisitionType.Purchase
import com.gu.support.acquisitions.PaymentFrequency.Monthly
import com.gu.support.acquisitions.PaymentProvider.PayPal
import com.gu.support.acquisitions.{AbTest, AcquisitionDataRow, AcquisitionEventTable, AcquisitionProduct, BigQueryService, PrintOptions, PrintProduct, QueryParameter}
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.{DateTime, DateTimeZone}
import org.joda.time.format.ISODateTimeFormat
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
    val query = s"""select * from ${AcquisitionEventTable.datasetName}.${AcquisitionEventTable.tableName} where amount = 9999 and event_timestamp > TIMESTAMP("2020-12-14 00:20:00");"""
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

    val dataRow = AcquisitionDataRow(
      DateTime.now(),
      AcquisitionProduct.Paper,
      Some(9999),
      Country.UK,
      Currency.GBP,
      Some("componentId"), Some("componentType"), Some("campaignCode"), Some("source"), Some("referrerUrl"),
      List(
        AbTest("test_test", "Hello"),
        AbTest("payment_method_test", "variant1")
      ),
      Monthly,
      Some(PayPal),
      Some(PrintOptions(PrintProduct.HomeDeliveryEveryday, Country.UK)),
      Some("browserId"),
      Some("9999"),
      Some("pageViewId"), Some("referrerPageViewId"), List("TEST_LABEL"), Some("test_promocode"),
      reusedExistingPaymentMethod = false,
      Direct,
      Purchase,
      Some("subscription number"), Some("account number"), Some("contributionId"),
      List(QueryParameter("foo", "bar"))
    )

    service.tableInsertRow(dataRow) shouldBe Right(())
  }

}
