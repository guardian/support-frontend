package com.gu.services

import com.gu.supporterdata.model.Stage.DEV
import com.gu.model.states.QueryType.Full
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
      config <- ConfigService(DEV).load
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(Full)
    } yield result

    futureResult.map { response =>
      response.id shouldNot be("")
      response.status shouldBe Submitted
    }
  }

}
