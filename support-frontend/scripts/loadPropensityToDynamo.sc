#!/usr/bin/env amm

/**
 * This script is to load a file exported from data science containing browserid -> product mappings
 * into DynamoDB.  This is a costly operation (order of 3 dollars) for 2 million rows, so ideally we would not
 * do that too frequently.
 */

import $ivy.`software.amazon.awssdk:dynamodb:2.17.214`
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, BatchWriteItemRequest, PutRequest, WriteRequest}

import java.io.{BufferedWriter, File, FileWriter}
import scala.jdk.CollectionConverters._
import scala.io.Source
import scala.util.{Failure, Success, Try}

val filename = "/Users/john_duffell/Downloads/bwidToProduct.csv"
val suffix = "_FAILED"
val batchSize = 1 // max 25

private def getRawLinesForFile(name: String) = {
  val source = Source.fromFile(name)
  val lines = Try(source.getLines().toList)
  source.close()
  lines.get
}

private def writeLinesToFile(name: String, lines: List[String]) = {
  val file = new File(name)
  val bw = new BufferedWriter(new FileWriter(file))
  bw.write(lines.mkString("\n"))
  bw.close()
}

@main
def loadFileToDynamo(): Unit = {
  val header :: data = getRawLinesForFile(filename)
  if (header != "bwid,product") {
    println("CSV file must have headings bwid,product")
  } else {
    val bwidProductList = data.map { rowString =>
      val bwid :: product :: _ = rowString.split(",").toList
      (bwid, product)
    }

    val batches = bwidProductList.grouped(batchSize).toList
    val unwritten = batches.flatMap(writeBatch)
    if (unwritten.isEmpty) {
      println("all batches written successfully")
    } else {
      println(unwritten.size + " batches not written, writing to a file")
      val fileLines = "bwid,product" :: unwritten.map { case (bwid, product) => bwid + "," + product }
      writeLinesToFile(filename + suffix, fileLines)
    }

  }
}

lazy val client = {
  import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider
  import software.amazon.awssdk.regions.Region
  import software.amazon.awssdk.services.dynamodb.DynamoDbClient
  val credentialsProvider = ProfileCredentialsProvider.create("membership")
  val region = Region.EU_WEST_1
  val ddb = DynamoDbClient.builder.region(region).credentialsProvider(credentialsProvider).build

  ddb
}

private def writeBatch(batch: List[(String, String)]) = {
  println("writing batch "+ batch.size + " items")
  val itemsToWrite = batch.map { case (bwid, product) =>
    WriteRequest.builder()
    .putRequest(
      PutRequest.builder()
        .item(
          Map(
            "bwid" -> AttributeValue.builder().s(bwid).build(),
            "product" -> AttributeValue.builder().s(product).build(),
          ).asJava
        )
        .build()
    ).build()
  }
  val request = BatchWriteItemRequest.builder()
    .requestItems(Map("hack-jun2022-propensity-products" -> itemsToWrite.asJava).asJava)
    .build()

  Try(client.batchWriteItem(request)) match {
    case Success(response) =>
      if (!response.unprocessedItems().isEmpty) {
        println("whoops - unprocessed items were present!")
      }
      println(response)
      val unprocessedItems = response.unprocessedItems().asScala.toMap.values.headOption.map(_.asScala.toList).getOrElse(List.empty)
      unprocessedItems.map { writeRequest =>
        val items = writeRequest.putRequest().item().asScala.toMap
        (items("bwid").s(), items("product").s())
      }
    case Failure(t) =>
      println("failed with error: " + t.toString)
      t.printStackTrace()
      batch
  }
}
