package com.gu.services

import com.gu.{model, supporterdata}
import com.gu.supporterdata.model.Stage.DEV
import com.gu.supporterdata.model.SupporterRatePlanItem
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

@IntegrationTest
class DynamoDBServiceSpec extends AsyncFlatSpec with Matchers {

  SupporterDataDynamoService.getClass.getSimpleName should "be able to insert an item" in {
    val service = SupporterDataDynamoService(DEV)
    val item = supporterdata.model.SupporterRatePlanItem(
      identityId = "999999",
      gifteeIdentityId = None,
      subscriptionName = "test-sub-name",
      productRatePlanId = "2c92c0f85a6b134e015a7fcd9f0c7855",
      productRatePlanName = "Monthly Contribution",
      termEndDate = LocalDate.now().plusDays(1),
      contractEffectiveDate = LocalDate.parse("2020-03-20"),
      contributionAmount = Some(20),
    )
    service
      .writeItem(item)
      .map(_.sdkHttpResponse.statusCode shouldBe 200)
  }
}
