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
      identityId = "999995",
      gifteeIdentityId = None,
      subscriptionName = "test-sub-name",
      productRatePlanId = "2c92a0fb4edd70c8014edeaa4e972204",
      productRatePlanName = "Digital Pack Annual",
      termEndDate = LocalDate.parse("2022-03-20"),
      contractEffectiveDate = LocalDate.parse("2020-03-20"),
      acquisitionMetadata = Some("{\"shouldGetDigitalSubBenefits\":true}"),
    )
    service
      .writeItem(item)
      .map(_.sdkHttpResponse.statusCode shouldBe 200)
  }
}
