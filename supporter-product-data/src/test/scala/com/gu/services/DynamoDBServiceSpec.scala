package com.gu.services

import com.gu.{model, supporterdata}
import com.gu.supporterdata.model.Stage.DEV
import com.gu.supporterdata.model.{ContributionAmount, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

@IntegrationTest
class DynamoDBServiceSpec extends AsyncFlatSpec with Matchers {

  SupporterDataDynamoService.getClass.getSimpleName should "be able to insert an item with no contribution amount" in {
    val service = SupporterDataDynamoService(DEV)
    val item = supporterdata.model.SupporterRatePlanItem(
      identityId = "999965",
      gifteeIdentityId = None,
      subscriptionName = "test-digi-sub-name",
      productRatePlanId = "2c92a0fb4edd70c8014edeaa4e972204",
      productRatePlanName = "Digital Pack Annual",
      termEndDate = LocalDate.now().plusDays(1),
      contractEffectiveDate = LocalDate.parse("2020-03-20"),
      contributionAmount = None,
    )
    service
      .writeItem(item)
      .map(_.sdkHttpResponse.statusCode shouldBe 200)
  }

  SupporterDataDynamoService.getClass.getSimpleName should "be able to insert an item with a contribution amount" in {
    val service = SupporterDataDynamoService(DEV)
    val item = supporterdata.model.SupporterRatePlanItem(
      identityId = "999965",
      gifteeIdentityId = None,
      subscriptionName = "test-sub-name",
      productRatePlanId = "2c92c0f85a6b134e015a7fcd9f0c7855",
      productRatePlanName = "Monthly Contribution",
      termEndDate = LocalDate.now().plusDays(1),
      contractEffectiveDate = LocalDate.parse("2020-03-20"),
      contributionAmount = Some(ContributionAmount(20, "GBP")),
    )
    service
      .writeItem(item)
      .map(_.sdkHttpResponse.statusCode shouldBe 200)
  }
}
