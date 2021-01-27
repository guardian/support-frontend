package com.gu.services

import com.gu.model.Stage.CODE
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

@IntegrationTest
class DynamoDBServiceSpec  extends AsyncFlatSpec with Matchers {

  "DynamoDBService" should "stream be able to insert an item" in {
    val service = DynamoDBService(CODE)
    val item = SupporterRatePlanItem(
      "999999",
      None,
      "1", "1", "Digital Subscription", "2021-01-01"
    )
    service.writeItem(item).map(_ => succeed)

  }
}
