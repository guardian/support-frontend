package controllers

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Domestic
import com.gu.support.workers._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class CreateSubscriptionControllerTest extends AnyFlatSpec with Matchers {

  "frontendProductKey" should "map DigitalPack to the catalog key DigitalSubscription" in {
    CreateSubscriptionController.frontendProductKey(
      DigitalPack(GBP, Monthly),
    ) shouldBe "DigitalSubscription"
  }

  it should "leave SupporterPlus unchanged because its class name already matches the catalog key" in {
    CreateSubscriptionController.frontendProductKey(
      SupporterPlus(12, GBP, Monthly),
    ) shouldBe "SupporterPlus"
  }

  it should "fall back to the simple class name for other products" in {
    CreateSubscriptionController.frontendProductKey(
      Contribution(5, GBP, Monthly),
    ) shouldBe "Contribution"

    CreateSubscriptionController.frontendProductKey(
      GuardianWeekly(GBP, Annual, Domestic),
    ) shouldBe "GuardianWeekly"

    CreateSubscriptionController.frontendProductKey(
      GuardianAdLite(GBP),
    ) shouldBe "GuardianAdLite"
  }
}
