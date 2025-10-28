package com.gu.model.dynamo

import com.gu.Fixtures
import kantan.csv.ops.toCsvInputOps
import kantan.csv.rfc
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import com.gu.model.dynamo.SupporterRatePlanItemCodecs._
import com.gu.supporterdata.model.SupporterRatePlanItem
import io.circe.parser._
import org.scalatest.Inside.inside

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

  "Dates" should "deserialise correctly" in {
    val json = """
       {
         "identityId": "99999999999",
         "subscriptionName": "1111111111111",
         "productRatePlanId": "in_app_purchase",
         "productRatePlanName": "uk.co.guardian.gla.6months",
         "termEndDate": "2026-01-11T18:11:20.000Z",
         "contractEffectiveDate": "2016-01-11T18:11:21.000Z"
       }
    """
    val item = decode[SupporterRatePlanItem](json)
    inside(item) { case Right(item) =>
      item.contractEffectiveDate.toString shouldBe "2016-01-11"
    }
  }
}
