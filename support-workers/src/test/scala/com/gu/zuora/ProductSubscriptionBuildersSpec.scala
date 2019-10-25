package com.gu.zuora

import java.util.UUID

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Domestic
import com.gu.support.config.Stages.DEV
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.{GuardianWeekly, Quarterly}
import com.gu.support.zuora.api.ReaderType
import com.gu.zuora.ProductSubscriptionBuilders._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._

class ProductSubscriptionBuildersSpec extends AnyFlatSpec with Matchers with ProductSubscriptionBuilder {
  "InitialTermLength" should "be correct" in {
    val termStart = new LocalDate(2019, 2, 3)
    val firstPaperDate = termStart.plusDays(3)
    val termLength = initialTermInDays(termStart, firstPaperDate, 3)
    termLength shouldBe 92
  }
  "GuardianWeeklySubscriptionBuilder" should "build a correct gift SubscriptionData" in {
    val weekly = GuardianWeekly(GBP, Quarterly, Domestic)
    val saleDate = new LocalDate(2019, 10, 24)
    val firstDeliveryDate = saleDate.plusDays(3)
    val promotionService = mock[PromotionService]
    val subscriptionData = weekly.build(UUID.randomUUID(), Country.UK, None, Some(firstDeliveryDate), promotionService, ReaderType.Gift, DEV, isTestUser = false)

    import subscriptionData._

    subscription.autoRenew shouldBe false
    subscription.contractAcceptanceDate shouldBe firstDeliveryDate
    subscription.termStartDate shouldBe saleDate
    subscription.initialTerm shouldBe 95
    subscription.initialTermPeriodType shouldBe "Day"
    ratePlanData.head.ratePlan.productRatePlanId shouldBe "2c92c0f96ded216a016df491134d4091"
  }

  "GuardianWeeklySubscriptionBuilder" should "build a correct non-gift SubscriptionData" in {
    val weekly = GuardianWeekly(GBP, Quarterly, Domestic)
    val saleDate = new LocalDate(2019, 10, 24)
    val firstDeliveryDate = saleDate.plusDays(3)
    val promotionService = mock[PromotionService]
    val subscriptionData = weekly.build(UUID.randomUUID(), Country.UK, None, Some(firstDeliveryDate), promotionService, ReaderType.Direct, DEV, isTestUser = false)

    import subscriptionData._

    subscription.autoRenew shouldBe true
    subscription.contractAcceptanceDate shouldBe firstDeliveryDate
    subscription.termStartDate shouldBe saleDate
    subscription.initialTerm shouldBe 12
    subscription.initialTermPeriodType shouldBe "Month"
    ratePlanData.head.ratePlan.productRatePlanId shouldBe "2c92c0f965dc30640165f150c0956859"
  }
}
