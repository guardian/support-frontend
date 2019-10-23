package com.gu.zuora

import java.util.UUID

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Domestic
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.{GuardianWeekly, Quarterly}
import com.gu.support.zuora.api.ReaderType
import com.gu.zuora.ProductSubscriptionBuilders._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._

class ProductSubscriptionBuildersSpec extends AnyFlatSpec with Matchers {
  "GuardianWeeklySubscriptionBuilder" should "build a correct gift SubscriptionData" in {
    val weekly = GuardianWeekly(GBP, Quarterly, Domestic)
    val deliveryDate = LocalDate.now().plusDays(3)
    val promotionService = mock[PromotionService]
    val subscriptionData = weekly.build(UUID.randomUUID(), Country.UK, None, Some(deliveryDate), promotionService, ReaderType.Gift, isTestUser = false)

    subscriptionData.subscription.autoRenew shouldBe false
    subscriptionData.subscription.contractAcceptanceDate shouldBe deliveryDate
    subscriptionData.subscription.contractEffectiveDate shouldBe deliveryDate
    subscriptionData.subscription.termStartDate shouldBe deliveryDate
    subscriptionData.ratePlanData.head.ratePlan.productRatePlanId shouldBe "2c92c0f96ded216a016df491134d4091"

  }
}
