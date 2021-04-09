package com.gu.model.dynamo

import com.gu.Fixtures
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SerialisationSpec extends AnyFlatSpec with Matchers {

  "SupporterRatePlanItem" should "deserialise correctly" in {
    val results = Fixtures.loadQueryResults

    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val items = csvReader.toList
    items.length shouldBe 10
    items.foreach(_.isRight shouldBe true)
  }

  "Kantan" should "handle drop correctly" in {
    val results = Fixtures.loadQueryResults

    val csvReader = results.asCsvReader[SupporterRatePlanItem](rfc.withHeader)

    csvReader.drop(0).toList.length shouldBe 10

  }
}
