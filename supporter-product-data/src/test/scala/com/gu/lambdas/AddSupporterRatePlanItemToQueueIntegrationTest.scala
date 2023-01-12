package com.gu.lambdas

import com.gu.model.states.AddSupporterRatePlanItemToQueueState
import com.gu.supporterdata.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.ZonedDateTime

@IntegrationTest
class AddSupporterRatePlanItemToQueueIntegrationTest extends AsyncFlatSpec with Matchers {

  "AddSupporterRatePlanItemToQueueLambda" should "process records correctly" in {
    val csvFilename = "select-active-rate-plans-2023-01-12T05:59:45.210958.csv"
    AddSupporterRatePlanItemToQueueLambda.addToQueue(
      DEV,
      AddSupporterRatePlanItemToQueueState(
        csvFilename,
        248,
        0,
        ZonedDateTime.parse("2023-01-11T21:59:53.743208-08:00[America/Los_Angeles]"),
      ),
      new TimeOutCheck {
        override def timeRemainingMillis: Int = 1000 * 60 * 5
      },
    )
  }.map(outState => outState.processedCount shouldBe 248)

}
