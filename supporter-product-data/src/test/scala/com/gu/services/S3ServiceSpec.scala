package com.gu.services

import com.gu.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.io.ByteArrayInputStream
import java.util.UUID

@IntegrationTest
class S3ServiceSpec extends AsyncFlatSpec with Matchers {

  "S3Service" should "stream to S3 successfully" in {
    val initialString = "text".getBytes()
    val stream = new ByteArrayInputStream(initialString)
    S3Service
      .streamToS3(DEV, s"test-file-${UUID.randomUUID().toString}", stream, initialString.length)
      .map(_ =>
        succeed
      )
  }
}
