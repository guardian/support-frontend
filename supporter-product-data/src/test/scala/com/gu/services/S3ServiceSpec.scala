package com.gu.services

import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.io.ByteArrayInputStream

@IntegrationTest
class S3ServiceSpec extends AsyncFlatSpec with Matchers {

  "S3Service" should "stream to S3 successfully" in {
    val initialString = "text".getBytes()
    val targetStream = new ByteArrayInputStream(initialString)
    S3Service
      .streamToS3(targetStream)
      .map(_ =>
        succeed
      )
  }
}
