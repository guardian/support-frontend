package com.gu.lambdas

import com.gu.Fixtures
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import com.gu.model.dynamo.SupporterRatePlanItemCodecs._
import com.gu.supporterdata.model.SupporterRatePlanItem

class AddSupporterRatePlanItemToQueueSpec extends AsyncFlatSpec with Matchers {

  "getUnprocessedItems" should "return the correct items" in {
    val results = Fixtures.loadQueryResults

    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)

    AddSupporterRatePlanItemToQueueLambda.getUnprocessedItems(csvReader, 2).length shouldBe 8
  }

}
