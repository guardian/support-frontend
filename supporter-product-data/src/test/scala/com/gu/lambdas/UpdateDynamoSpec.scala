package com.gu.lambdas

import com.gu.Fixtures
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import com.gu.model.dynamo.SupporterRatePlanItemCodecs._
import com.gu.supporterdata.model.SupporterRatePlanItem

class AddSubscriptionsToQueueSpec extends AsyncFlatSpec with Matchers {

  "getUnprocessedItems" should "return the correct items" in {
    val results = Fixtures.loadQueryResults

    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)

    AddSubscriptionsToQueueLambda.getUnprocessedItems(csvReader, 2).length shouldBe 8
  }

  "batchItemsWhichCanUpdateConcurrently" should "return the correct items" in {
    val results = Fixtures.loadQueryResults
    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val items = csvReader.zipWithIndex.toList.collect { case (Right(item), index) => (item, index) }

    val batchedItems = AddSubscriptionsToQueueLambda.batchItemsWhichCanUpdateConcurrently(items)

    // The test rows should batch up into 3 separate lists - there are two rows which are not
    // suitable to run concurrently because they belong to the same subscription at index 6 & 7
    // so the pattern is
    // - items 0 - 4 can all run concurrently and so are allocated to the same batch (up to max batch size of 5)
    // - items 5 & 6 are unrelated and so go in a batch
    // - then we get to index 7 which cannot go into the same batch as 6 so a new batch is started with this and the final 2 items
    batchedItems.map(_.map(_._2)) shouldBe List(List(0, 1, 2, 3, 4), List(5, 6), List(7, 8, 9))
  }

}
