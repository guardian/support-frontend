package com.gu.lambdas

import com.gu.Fixtures
import com.gu.model.Stage.CODE
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.model.states.UpdateDynamoState
import com.gu.test.tags.annotations.IntegrationTest
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class UpdateDynamoSpec extends AsyncFlatSpec with Matchers {
  "UpdateDynamoLambda" should "succeed" in {
    UpdateDynamoLambda.writeToDynamo(
      stage = CODE,
      UpdateDynamoState(
        filename = "New Subscriptions-2c92c0867728a2e801772ade71bb56a5",
        recordCount = 50,
        processedCount = 0
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
