package com.gu.services

import com.gu.Fixtures
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import kantan.csv._
import kantan.csv.ops._

import java.io.ByteArrayInputStream



//TODO: Do we need these tests?
class KantanSpec extends AnyFlatSpec with Matchers {
  "Kantan" should "be able to read from a stream" in {
    val resultsStream = new ByteArrayInputStream(Fixtures.loadQueryResults.getBytes)

    val reader = resultsStream.asCsvReader[List[String]](rfc)
    reader.foreach(println)
    succeed
  }

  it should "be able to stream from S3" in {
    val reader = S3Service.streamFromS3("New Subscriptions-2c92c085771fa1a701772072be75492f").asCsvReader[List[String]](rfc)
    reader.foreach(println)
    succeed
  }
}
