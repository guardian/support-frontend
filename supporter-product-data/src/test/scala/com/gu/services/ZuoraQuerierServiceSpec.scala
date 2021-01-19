package com.gu.services

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage.CODE
import com.gu.model.zuora.response.JobStatus.Submitted
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.duration._

@IntegrationTest
class ZuoraQuerierServiceSpec extends AsyncFlatSpec with Matchers {
  "ZuoraQuerierService" should "run a query successfully" in {
    val futureResult = for {
      config <- ZuoraQuerierConfig.load(CODE)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery()
    } yield result

    futureResult.map {
      response =>
        response.id shouldNot be("")
        response.status shouldBe Submitted
    }
  }
}
