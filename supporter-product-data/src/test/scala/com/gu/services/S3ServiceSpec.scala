package com.gu.services

import com.gu.supporterdata.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.io.ByteArrayInputStream
import java.util.UUID
import scala.io.Source

@IntegrationTest
class S3ServiceSpec extends AsyncFlatSpec with Matchers {

  S3Service.getClass.getSimpleName should "stream to S3 successfully" in {
    val initialString = "text"
    val stream = new ByteArrayInputStream(initialString.getBytes())
    val filename = s"test-file-${UUID.randomUUID().toString}"
    S3Service
      .streamToS3(DEV, filename, stream, initialString.length)
    Source.fromInputStream(S3Service.streamFromS3(DEV, filename).getObjectContent).mkString shouldBe initialString
  }
}
