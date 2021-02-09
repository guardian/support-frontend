package com.gu.lambdas

import com.gu.Fixtures
import com.gu.model.Stage.DEV
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.model.states.UpdateDynamoState
import com.gu.test.tags.annotations.IntegrationTest
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.ZonedDateTime

@IntegrationTest
class UpdateDynamoSpec extends AsyncFlatSpec with Matchers {
  "UpdateDynamoLambda" should "succeed" in {
    UpdateDynamoLambda.writeToDynamo(
      stage = DEV,
      UpdateDynamoState(
        filename = "New Subscriptions-2c92c0867728a2e801772ade71bb56a5",
        recordCount = 50,
        processedCount = 0,
        ZonedDateTime.now
      ),
      new TimeOutCheck {
        override def timeRemainingMillis = 9999999
      }
    ).map(_ =>
      succeed
    )
  }

  "getUnprocessedItems" should "return the correct items" in {
    val results = Fixtures.loadQueryResults

    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)

    UpdateDynamoLambda.getUnprocessedItems(csvReader, 2).length shouldBe 1
  }
}
