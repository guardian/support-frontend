package com.gu.services

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage.DEV
import com.gu.model.states.QueryType.Full
import com.gu.model.zuora.response.JobStatus.Submitted
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate
import scala.concurrent.duration._

@IntegrationTest
class ZuoraQuerierServiceSpec extends AsyncFlatSpec with Matchers {
  "ZuoraQuerierService" should "run a query successfully" in {
    val futureResult = for {
      config <- ZuoraQuerierConfig.load(DEV)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(Full)
    } yield result

    futureResult.map {
      response =>
        response.id shouldNot be("")
        response.status shouldBe Submitted
    }
  }

  it should "upload a file to S3 successfully" in {
    val fileId = "2c92c085771fa1a70177202f9ae63130"
    val futureResult = for {
      config <- ZuoraQuerierConfig.load(DEV)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      response <- service.getResultFileResponse(fileId)
      uploadResult <- S3Service.streamToS3(DEV, s"upload-test-file-$fileId", response.body.byteStream(), response.body.contentLength)
    } yield uploadResult
    futureResult.map(_ =>
      succeed
    )
  }
}
