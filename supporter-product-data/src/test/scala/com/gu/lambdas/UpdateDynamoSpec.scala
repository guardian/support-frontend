package com.gu.lambdas

import com.gu.Fixtures
import com.gu.model.dynamo.SupporterRatePlanItem
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class UpdateDynamoSpec extends AsyncFlatSpec with Matchers {

  "getUnprocessedItems" should "return the correct items" in {
    val results = Fixtures.loadQueryResults

    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)

    UpdateDynamoLambda.getUnprocessedItems(csvReader, 2).length shouldBe 1
  }
}
