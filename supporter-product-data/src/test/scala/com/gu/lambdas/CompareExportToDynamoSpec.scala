package com.gu.lambdas

import com.gu.services.SqsService
import com.gu.supporterdata.model.{Stage, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import kantan.csv.ops.{toCsvInputOps, toCsvOutputOps}
import kantan.csv.rfc
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.io.File
import java.util.concurrent.Executors
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.io.Codec.fallbackSystemCodec
import scala.io.Source

@IntegrationTest
class CompareExportToDynamoSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "This test compares the export in  supporter-product-data/data-extracts to the data in DynamoDB. There " should
    "not be any missing identity ids in Dynamo" in {
      val stage = Stage.PROD

      val results = loadQueryResults
      val csvReader = results.asCsvReader[SupporterRatePlanItemWithStatus](rfc.withHeader)

      val items = csvReader.collect { case Right(item) => item }.toList
      println(s"found ${items.length} rows in CSV")
      val dynamoService = SupporterDataDynamoService(stage)
      val activeItems = items
        .filter(_.subscriptionStatus == "Active")
        .filter(_.termEndDate.isAfter(java.time.LocalDate.now().minusDays(1)))
      println(s"found ${activeItems.length} active items to check")

      val executorService = Executors.newFixedThreadPool(50)
      implicit val ec = ExecutionContext.fromExecutor(executorService)

      var missing = 0
      var found = 0

      val eventualTuples = activeItems
        .map { item =>
          Await.result(
            dynamoService
              .subscriptionExists(item.identityId, item.subscriptionName)
              .map {
                case Right(exists) =>
                  if (!exists) {
                    missing += 1
                    println(s"${item.identityId} ${item.subscriptionName} does not exist in Dynamo")
                    println(s"Missing: $missing, Found: $found")
                  } else {
                    found += 1
                  }
                  (exists, item)
                case Left(error) =>
                  logger.error(s"Error checking ${item.identityId} ${item.subscriptionName} - $error")
                  fail
              },
            Duration(10, "seconds"),
          )
        }

      val (exists, doesNotExist) = eventualTuples.partition(tuple => tuple._1)
      println(s"Found ${exists.length} items in Dynamo")
      saveResults("missing-from-dynamo.csv", doesNotExist.map(_._2))
      saveResults("found-in-dynamo.csv", exists.map(_._2))
      assert(condition = true)

    }
  "None of the missing items" should "exist in Dynamo" in {
    val missing = Source.fromFile("./supporter-product-data/data-extracts/missing-from-dynamo.csv").mkString
    val csvReader = missing.asCsvReader[SupporterRatePlanItemWithStatus](rfc.withHeader)
    val items = csvReader.collect { case Right(item) => item }.toList
    val dynamoService = SupporterDataDynamoService(Stage.PROD)
    val executorService = Executors.newFixedThreadPool(1)
    implicit val ec = ExecutionContext.fromExecutor(executorService)
    items.foreach { item =>
      println(s"Checking ${item.identityId} ${item.subscriptionName}")
      Await.result(
        dynamoService.subscriptionExists(item.identityId, item.subscriptionName).map { exists =>
          assert(exists.contains(false), s"${item.identityId} ${item.subscriptionName} exists in Dynamo")
        },
        Duration(10, "seconds"),
      )
    }
    assert(condition = true)
  }
  "Missing subscriptions" should "be added to Dynamo" in {
    val sqsService = SqsService(Stage.PROD)
    val missing = Source.fromFile("./supporter-product-data/data-extracts/missing-from-dynamo.csv").mkString
    val csvReader = missing.asCsvReader[SupporterRatePlanItemWithStatus](rfc.withHeader)
    val batches = csvReader
      .collect { case Right(item) => item }
      .toList
      .map(item =>
        SupporterRatePlanItem(
          item.subscriptionName,
          item.identityId,
          None,
          item.productRatePlanId,
          item.productRatePlanName,
          item.termEndDate,
          item.termEndDate.minusYears(1),
          None,
        ),
      )
      .zipWithIndex
      .grouped(10)
    batches.foreach(sqsService.sendBatch)
    assert(condition = true)
  }
  "An individual subscription" should "exist in Dynamo" in {
    val identityId = "100002649"
    val subscriptionName = "A-S01060830"
    val stage = Stage.PROD

    val dynamoService = SupporterDataDynamoService(stage)
    dynamoService.subscriptionExists(identityId, subscriptionName).map { exists =>
      assert(exists.contains(true))
    }
  }

  def loadQueryResults: String = Source.fromFile("./supporter-product-data/data-extracts/last-Full-PROD.csv").mkString
  def saveResults(filename: String, items: List[SupporterRatePlanItemWithStatus]) = {
    val out = new File(s"${System.getProperty("user.dir")}/supporter-product-data/data-extracts/$filename")
    out.writeCsv(items, rfc.withHeader)
    println(s"Saved ${items.length} items to ${out.getAbsolutePath}")
  }
}
